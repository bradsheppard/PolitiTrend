# pylint: disable=redefined-outer-name

from typing import List

import pytest

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import SentimentAnalyzer


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democratic')
    ]

    return politicians


@pytest.fixture(scope='module')
def sentiment_analyzer():
    return SentimentAnalyzer()


def test_get_entity_sentiments_postive_sentence(politicians: List[Politician],
                                                sentiment_analyzer: SentimentAnalyzer):
    sentence = 'John Smith is great!'

    predictions = sentiment_analyzer.get_entity_sentiments([sentence], [politicians])
    assert predictions[0][2] > 0


def test_get_entity_sentiments_negative_sentence(politicians: List[Politician],
                                                 sentiment_analyzer: SentimentAnalyzer):
    sentence = 'John Smith is terrible'
    predictions = sentiment_analyzer.get_entity_sentiments([sentence], [politicians])
    assert predictions[0][2] < 0


def test_get_entity_sentiments_subject_results(politicians: List[Politician],
                                               sentiment_analyzer: SentimentAnalyzer):
    sentence = 'Bob Young is awesome. John Smith is terrible though.'
    predictions = sentiment_analyzer.get_entity_sentiments([sentence], [politicians])
    bob_score = predictions[0][1]
    john_score = predictions[0][2]
    assert bob_score > 0
    assert john_score < 0


def test_get_entity_sentiments_non_specific_subject(politicians: List[Politician],
                                                    sentiment_analyzer: SentimentAnalyzer):
    sentence = 'I\'m awesome'
    predictions = sentiment_analyzer.get_entity_sentiments([sentence], [politicians])
    assert 1 not in predictions[0]
    assert 2 not in predictions[0]
