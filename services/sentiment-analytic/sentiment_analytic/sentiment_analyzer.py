import csv
import math
import urllib
from statistics import mean
from typing import List, Dict

import networkx as nx
import numpy as np
import spacy
from functional import seq
from scipy.special import softmax
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer

from sentiment_analytic.politician import Politician


class SentimentAnalyzer:

    def __init__(self):
        self._tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base")
        self._model = TFAutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
        self._nlp = spacy.load('en')

        mapping_link = f"https://raw.githubusercontent.com/cardiffnlp/tweeteval/main/datasets/sentiment/mapping.txt"
        with urllib.request.urlopen(mapping_link) as f:
            html = f.read().decode('utf-8').split("\n")
            csvreader = csv.reader(html, delimiter='\t')
        self._labels = [row[1] for row in csvreader if len(row) > 1]

    def compute_sentiment(self, text: str) -> float:
        encoded_input = self._tokenizer(text, return_tensors='tf')
        output = self._model(encoded_input)
        scores = output[0][0].numpy()
        scores = softmax(scores)

        ranking = np.argsort(scores)
        ranking = ranking[::-1]

        result = 0

        for i in range(scores.shape[0]):
            label = self._labels[ranking[i]]
            score = scores[ranking[i]]
            if label == 'negative':
                result -= score
            elif label == 'positive':
                result += score

        return result

    def compute_sentiments(self, statements: List[str]):
        encoded_input = self._tokenizer(statements, padding=True, truncation=True, return_tensors='tf')
        model_output = self._model(encoded_input)
        model_output = model_output.logits.numpy()

        results = []

        for output in model_output:
            scores = softmax(output)

            ranking = np.argsort(scores)
            ranking = ranking[::-1]

            result = 0

            for i in range(scores.shape[0]):
                label = self._labels[ranking[i]]
                score = scores[ranking[i]]
                if label == 'negative':
                    result -= score
                elif label == 'positive':
                    result += score

            results.append(result)

        return results

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

    def get_entity_sentiments(self, statements: List[str],
                              subjects: List[List[Politician]] = None) -> List[Dict[int, float]]:
        # pylint: disable=too-many-locals
        # pylint: disable=too-many-branches
        result_list = []
        pipeline = self._nlp.pipe(statements)

        sentence_lists = []
        for doc in list(pipeline):
            document_sentences = seq(doc.sents).map(lambda x: x.text).to_list()
            sentence_lists.append(document_sentences)

        sentences = [sentence for sublist in sentence_lists for sentence in sublist]
        sentiments = self.compute_sentiments(sentences)

        sentence_index = 0
        for i, doc in enumerate(self._nlp.pipe(statements)):
            current_subjects = subjects[i]
            results = {}

            for j, sent in enumerate(doc.sents):
                score = sentiments[sentence_index]
                sentence_index += 1
                pos_words = self._get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'])
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
                    politicians = self._match_politicians(entity, current_subjects)
                    for politician in politicians:
                        if politician.id not in results:
                            results[politician.id] = [score]
                        else:
                            results[politician.id].append(score)

            for key in results:
                results[key] = mean(results[key])
            result_list.append(results)

        return result_list
