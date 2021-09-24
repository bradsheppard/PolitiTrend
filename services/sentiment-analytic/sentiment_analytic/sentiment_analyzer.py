# pylint: disable=not-callable
import math
from statistics import mean
from typing import List, Dict

import networkx as nx
import spacy
import tensorflow as tf
from functional import seq
from tensorflow.python.distribute.tpu_strategy import TPUStrategyV2
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification, DistilBertConfig

from sentiment_analytic.config import config
from sentiment_analytic.politician import Politician

spacy.prefer_gpu()


class SentimentAnalyzer:

    tokenizer = None
    model = None
    nlp = None
    labels = None
    strategy: TPUStrategyV2 = None

    @staticmethod
    def load():
        if SentimentAnalyzer.model is not None:
            return

        if config.analytic_use_tpus:
            resolver = tf.distribute.cluster_resolver.TPUClusterResolver()
            tf.config.experimental_connect_to_cluster(resolver)
            tf.tpu.experimental.initialize_tpu_system(resolver)

            strategy = tf.distribute.TPUStrategy(resolver)
        else:
            strategy = tf.distribute.MirroredStrategy(devices=['GPU:0'])

        SentimentAnalyzer.strategy = strategy
        SentimentAnalyzer.tokenizer = AutoTokenizer\
            .from_pretrained('distilbert-base-uncased-finetuned-sst-2-english', use_fast=True)

        model_config = DistilBertConfig \
            .from_pretrained('distilbert-base-uncased-finetuned-sst-2-english')
        model_config.use_bfloat16 = True

        with strategy.scope():
            SentimentAnalyzer.model = TFAutoModelForSequenceClassification\
                .from_pretrained('distilbert-base-uncased-finetuned-sst-2-english',
                                 config=model_config)
        SentimentAnalyzer.nlp = spacy.load('en')

    @staticmethod
    def compute_sentiments(statements: List[str]):
        tokens = SentimentAnalyzer\
            .tokenizer(statements, padding='max_length', truncation=True,
                       return_tensors='tf', max_length=256)

        dataset = tf.data.Dataset.from_tensor_slices(
            (tokens['input_ids'], tokens['attention_mask'])
        ).batch(config.analytic_sentiment_computation_tensorflow_batch)
        dataset = dataset.prefetch(tf.data.experimental.AUTOTUNE)

        distributed_dataset = SentimentAnalyzer.strategy.experimental_distribute_dataset(dataset)

        all_results = []

        for batch in distributed_dataset:
            logits = SentimentAnalyzer.do_compute_sentiments(batch)
            logits = SentimentAnalyzer.strategy.experimental_local_results(logits)
            logits = tf.concat(logits, 0)

            for logit in logits:
                numpy = logit.numpy()

                if numpy[0] > numpy[1]:
                    all_results.append(-numpy[0])
                else:
                    all_results.append(numpy[1])

        return all_results

    @staticmethod
    @tf.function
    def execute_model(statements):
        outputs = SentimentAnalyzer.model(statements)
        result = tf.nn.softmax(outputs.logits, axis=-1)

        return result

    @staticmethod
    def do_compute_sentiments(batch):
        model_result = SentimentAnalyzer.strategy.run(
            SentimentAnalyzer.execute_model, args=(batch,))
        return model_result

    @staticmethod
    def _match_politicians(text, politicians) -> List[Politician]:
        results = []

        for politician in politicians:
            split_name = politician.name.split()
            for name in split_name:
                if name in text:
                    results.append(politician)
        return results

    @staticmethod
    def _get_pos_subjects(doc, pos_list) -> List[str]:
        results = []
        for word in doc:
            if word.pos_ in pos_list:
                results.append(word.text)

        return results

    @staticmethod
    def get_entity_sentiments(statements: List[str],
                              subjects: List[List[Politician]] = None) -> List[Dict[int, float]]:
        # pylint: disable=too-many-locals
        # pylint: disable=too-many-branches
        result_list = []
        pipeline = list(SentimentAnalyzer.nlp.pipe(statements))

        sentiments = SentimentAnalyzer.compute_sentiments(statements)

        for i, doc in enumerate(pipeline):
            current_subjects = subjects[i]
            results = {}

            score = sentiments[i]
            pos_words = SentimentAnalyzer._get_pos_subjects(doc, ['VERB', 'ADJ', 'NOUN'])
            entities = seq(doc.ents) \
                .filter(lambda x: x.label_ == 'PERSON') \
                .map(lambda x: x.text) \
                .list()

            if len(entities) == 0:
                result_list.append(results)
                continue

            graph = nx.Graph()

            for token in doc:
                for child in token.children:
                    dep = child.dep_
                    weight = 0 if dep == 'conj' else 1
                    graph.add_edge('{0}'.format(token), '{0}'.format(child), weight=weight)

            path_lengths = {entity: 0 for entity in entities}

            for word in pos_words:
                for entity in entities:
                    names = entity.split()
                    try:
                        shortest_path = min(
                            [nx.dijkstra_path_length(
                                graph, source=word, target=name) for name in names])
                    except (nx.NetworkXNoPath, nx.NodeNotFound):
                        shortest_path = math.inf
                    path_lengths[entity] += shortest_path

            shortest_length = min(path_lengths.values())

            relevant_entities = seq(path_lengths.items()) \
                .filter(lambda x, length=shortest_length: x[1] == length) \
                .map(lambda x: x[0])

            for entity in relevant_entities:
                politicians = SentimentAnalyzer._match_politicians(entity, current_subjects)
                for politician in politicians:
                    if politician.id not in results:
                        results[politician.id] = [score]
                    else:
                        results[politician.id].append(score)

            for key in results:
                results[key] = mean(results[key])
            result_list.append(results)

        return result_list
