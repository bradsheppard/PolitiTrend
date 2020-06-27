from typing import List

import pytest
import pandas as pd

from state_party_affiliation_analytic.model.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer.sentiment_analyzer import get_entity_sentiments


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democrat')
    ]

    return politicians


# def test_get_entity_sentiments(spark_context, politicians):
#     test_data = [
#         {
#             'tweetText': 'Bob Young is awesome',
#             'politicians': [1]
#         },
#         {
#             'tweetText': 'Bob Young is awesome',
#             'politicians': [1]
#         },
#         {
#             'tweetText': 'John Smith sucks',
#             'politicians': [2]
#         }
#     ]
#
#     expected_data = [
#         {
#             'sentiment': 0.6248999834060669,
#             'politician': 1,
#             'sampleSize': 2
#         },
#         {
#             'sentiment': -0.3612000048160553,
#             'politician': 2,
#             'sampleSize': 1
#         }
#     ]
#
#     dataframe = spark_context.createDataFrame(test_data)
#
#     ouput_dataframe = analyze(dataframe, politicians).toPandas()
#     expected_dataframe = spark_context.createDataFrame(expected_data).toPandas()
#
#     pd.testing.assert_frame_equal(expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)


def test_get_entity_sentiments_postive_sentence(politicians):
    sentence = 'John Smith is great!'

    prediction = get_entity_sentiments(sentence, politicians)
    assert prediction[2] > 0.6


def test_get_entity_sentiments_negative_sentence(politicians):
    sentence = 'John Smith is terrible'
    prediction = get_entity_sentiments(sentence, politicians)
    assert prediction[2] < 0.4


def test_get_entity_sentiments_subject_results(politicians):
    sentence = 'Bob Young is awesome. John Smith is terrible though.'
    prediction = get_entity_sentiments(sentence, politicians)
    bob_score = prediction[1]
    john_score = prediction[2]
    assert bob_score > 0.6
    assert john_score < 0.4


def test_get_entity_sentiments_non_specific_subject(politicians):
    sentence = 'I\'m awesome'
    prediction = get_entity_sentiments(sentence, politicians)
    assert 1 not in prediction
    assert 2 not in prediction

