# pylint: disable=redefined-outer-name

from typing import List

import pandas as pd
import pytest

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import analyze, to_results_dataframe
from sentiment_analytic.sentiment_analyzer import get_entity_sentiments


@pytest.fixture()
def test_data():
    data = [
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-05 04:57:45'
        },
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'dateTime': '2020-11-06 04:57:45'
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'dateTime': '2020-11-07 04:57:45'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-08 04:57:45'
        }
    ]

    return data


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Bob Young'),
        Politician(2, 'John Smith')
    ]

    return politicians


def test_analyze_sentiments(spark_session, politicians, test_data):
    expected_data = [
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'politicianSentiments': [1],
            'sentiments': [0.6248999834060669],
            'dateTime': '2020-11-06 04:57:45'
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'politicianSentiments': [2],
            'sentiments': [-0.3612000048160553],
            'dateTime': '2020-11-07 04:57:45'
        },
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [0.6248999834060669, 0.6248999834060669],
            'dateTime': '2020-11-05 04:57:45'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [-0.3612000048160553, 0.6248999834060669],
            'dateTime': '2020-11-08 04:57:45'
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    ouput_dataframe = analyze(dataframe, politicians).toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)


def test_get_entity_sentiments_postive_sentence(politicians):
    sentence = 'John Smith is great!'

    predictions = get_entity_sentiments([sentence], politicians)
    assert predictions[0][2] > 0.6


def test_get_entity_sentiments_negative_sentence(politicians):
    sentence = 'John Smith is terrible'
    predictions = get_entity_sentiments([sentence], politicians)
    assert predictions[0][2] < 0.4


def test_get_entity_sentiments_subject_results(politicians):
    sentence = 'Bob Young is awesome. John Smith is terrible though.'
    predictions = get_entity_sentiments([sentence], politicians)
    bob_score = predictions[0][1]
    john_score = predictions[0][2]
    assert bob_score > 0.6
    assert john_score < 0.4


def test_get_entity_sentiments_non_specific_subject(politicians):
    sentence = 'I\'m awesome'
    predictions = get_entity_sentiments([sentence], politicians)
    assert 1 not in predictions[0]
    assert 2 not in predictions[0]


def test_to_results_dataframe(spark_session, politicians, test_data):
    expected_data = [
        {
            'sentiment': 0.2961999873320262,
            'politician': 1,
            'sampleSize': 3
        },
        {
            'sentiment': 0.2961999873320262,
            'politician': 2,
            'sampleSize': 3
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    ouput_dataframe = to_results_dataframe(analyze(dataframe, politicians)).toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)
