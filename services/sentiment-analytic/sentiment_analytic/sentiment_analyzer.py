import math
from statistics import mean
from typing import List, Dict

import networkx as nx
import spacy
from functional import seq
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from sentiment_analytic.politician import Politician


class SentimentAnalyzer:

    def __init__(self):
        self._analyzer = SentimentIntensityAnalyzer()
        self._nlp = spacy.load('en')

    def compute_sentiment(self, text: str) -> float:
        return self._analyzer.polarity_scores(text)['compound']

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
        for i, doc in enumerate(self._nlp.pipe(statements)):
            current_subjects = subjects[i]
            results = {}
            for sent in doc.sents:
                score = self._analyzer.polarity_scores(sent.text)['compound']
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
