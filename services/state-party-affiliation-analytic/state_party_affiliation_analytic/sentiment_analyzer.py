import spacy
import math
from typing import Dict, List
import networkx as nx
from functional import seq
from statistics import mean

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from state_party_affiliation_analytic.politician import Politician

sentiment_analyzer = SentimentIntensityAnalyzer()

nlp = spacy.load('en')


def get_party_sentiments(statements: List[str],
                         subjects: List[Politician] = None) -> List[Dict[str, float]]:
    # pylint: disable=cell-var-from-loop
    # pylint: disable=too-many-locals
    # pylint: disable=too-many-branches
    results_list = []
    for doc in nlp.pipe(statements):
        results = {}
        for sent in doc.sents:
            score = sentiment_analyzer.polarity_scores(sent.text)['compound']
            pos_words = _get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'])
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
                .filter(lambda x: x[1] == shortest_length) \
                .map(lambda x: x[0])

            for entity in relevant_entities:
                politicians = _match_politicians(entity, subjects)
                for politician in politicians:
                    if politician.party not in results:
                        results[politician.party] = [score]
                    else:
                        results[politician.party].append(score)

        for key in results:
            results[key] = mean(results[key])
        results_list.append(results)

    return results_list


def _get_pos_subjects(doc, pos_list) -> List[str]:
    results = []
    for word in doc:
        if word.pos_ in pos_list:
            results.append(word.text)

    return results


def _match_politicians(text, politicians) -> List[Politician]:
    results = []

    for politician in politicians:
        split_name = politician.name.split()
        for name in split_name:
            if name in text:
                results.append(politician)
    return results
