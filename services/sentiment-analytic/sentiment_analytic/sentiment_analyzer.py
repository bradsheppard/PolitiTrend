import math
from statistics import mean
from typing import List, Dict

import networkx as nx
import numpy as np
import spacy
import tensorflow as tf
import tensorflow.keras as keras
import tensorflow.keras.layers as layers
from functional import seq
from tensorflow.python.tpu import tpu_estimator
from transformers import AutoTokenizer, TFDistilBertModel

from sentiment_analytic.politician import Politician


class SentimentAnalyzer:

    tokenizer = None
    model = None
    nlp = None
    labels = None

    LABELS = {"NEG": 0, "POS": 1}
    classes = list(LABELS.keys())

    @staticmethod
    def load():
        if SentimentAnalyzer.model is not None:
            return

        resolver = tf.distribute.cluster_resolver.TPUClusterResolver()
        tf.config.experimental_connect_to_cluster(resolver)
        tf.tpu.experimental.initialize_tpu_system(resolver)

        strategy = tf.distribute.TPUStrategy(resolver)

        with strategy.scope():
            SentimentAnalyzer.tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english')

            input_ids = tf.keras.Input(shape=(128,), dtype='int32', name='input_ids')
            attention_mask = tf.keras.Input(shape=(128,), dtype='int32', name='attention_mask')

            inputs = [input_ids, attention_mask]

            transformer = TFDistilBertModel.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
            bert_outputs = transformer(inputs)

            last_hidden_states = bert_outputs.last_hidden_state
            avg = layers.GlobalAveragePooling1D()(last_hidden_states)
            output = layers.Dense(1, activation="sigmoid")(avg)
            model = keras.Model(inputs=inputs, outputs=output)

            SentimentAnalyzer.model = model
        SentimentAnalyzer.nlp = spacy.load('en')

    @staticmethod
    def compute_sentiments(statements: List[str]):
        inputs = np.asarray(statements)
        inputs = SentimentAnalyzer.prepare_bert_input(inputs, 128)

        results = []

        outputs = SentimentAnalyzer.model.predict(inputs)

        for output in outputs:
            sentiment = output[0]
            results.append(sentiment)

        return results

    @staticmethod
    def prepare_bert_input(sentences, seq_len):
        encodings = SentimentAnalyzer.tokenizer(sentences.tolist(), truncation=True, padding='max_length',
                              max_length=seq_len)
        input = [np.array(encodings["input_ids"]),
                 np.array(encodings["attention_mask"])]
        return input

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

            for j, sent in enumerate(doc.sents):
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
