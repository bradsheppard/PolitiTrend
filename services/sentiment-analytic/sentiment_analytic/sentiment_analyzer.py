# pylint: disable=not-callable
import math
from statistics import mean
from typing import List, Dict

import networkx as nx
import spacy
import tensorflow as tf
from functional import seq
from tensorflow.python.distribute.tpu_strategy import TPUStrategyV2
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification

from sentiment_analytic.config import config
from sentiment_analytic.politician import Politician


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
            strategy = tf.distribute.MirroredStrategy(devices=['GPU:0', 'GPU:1'])

        SentimentAnalyzer.strategy = strategy
        SentimentAnalyzer.tokenizer = AutoTokenizer\
            .from_pretrained('distilbert-base-uncased-finetuned-sst-2-english', use_fast=True)

        with strategy.scope():
            SentimentAnalyzer.model = TFAutoModelForSequenceClassification\
                .from_pretrained('distilbert-base-uncased-finetuned-sst-2-english')
        SentimentAnalyzer.nlp = spacy.load('en')

    @staticmethod
    def compute_sentiments(statements: List[str]):
        tokens = SentimentAnalyzer\
            .tokenizer(statements, padding=True, truncation=True, return_tensors='tf')

        dataset = tf.data.Dataset.from_tensor_slices(
            (tokens['input_ids'], tokens['attention_mask'])
        ).batch(config.analytic_sentiment_computation_tensorflow_batch)

        distributed_dataset = SentimentAnalyzer.strategy.experimental_distribute_dataset(dataset)

        results = []

        replica_results = []

        for batch in distributed_dataset:
            replica_results.append(SentimentAnalyzer.do_compute_sentiments(batch))

        for replica_result in replica_results:
            batch_result = []
            for value in replica_result.values:
                for tensor in value:
                    np_element = tensor.numpy()
                    result = np_element[1] - np_element[0]
                    batch_result.append(result)

            results.append(batch_result)

        results = [item for sublist in results for item in sublist]

        return results

    @staticmethod
    @tf.function
    def do_compute_sentiments(batch):
        def execute_model(statements):
            outputs = SentimentAnalyzer.model(statements)
            result = tf.nn.softmax(outputs.logits, axis=-1)

            return result

        model_result = SentimentAnalyzer.strategy.run(execute_model, args=(batch,))

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
        pipeline = SentimentAnalyzer.nlp.pipe(statements)

        sentence_lists = []
        for doc in list(pipeline):
            document_sentences = seq(doc.sents).map(lambda x: x.text).to_list()
            sentence_lists.append(document_sentences)

        sentences = [sentence for sublist in sentence_lists for sentence in sublist]
        sentiments = SentimentAnalyzer.compute_sentiments(sentences)

        sentence_index = 0
        for i, doc in enumerate(SentimentAnalyzer.nlp.pipe(statements)):
            current_subjects = subjects[i]
            results = {}

            for _, sent in enumerate(doc.sents):
                score = sentiments[sentence_index]
                sentence_index += 1
                pos_words = SentimentAnalyzer._get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'])
                entities = seq(sent.ents) \
                    .filter(lambda x: x.label_ == 'PERSON') \
                    .map(lambda x: x.text) \
                    .list()

                if len(entities) == 0:
                    continue

                graph = nx.Graph()

                for token in sent:
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
                        except nx.NetworkXNoPath:
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
