# pylint: disable=redefined-outer-name

from typing import List

import pytest
import pandas as pd

from pyspark.sql import SparkSession

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import analyze
from sentiment_analytic.sentiment_analyzer import get_entity_sentiments


@pytest.fixture(scope='session')
def spark_context():
    spark_context = SparkSession.builder \
        .master('local[*]') \
        .getOrCreate()

    return spark_context


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Bob Young'),
        Politician(2, 'John Smith')
    ]

    return politicians


def test_get_entity_sentiments(spark_context, politicians):
    test_data = [
        {
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2]
        },
        {
            'tweetText': 'Bob Young is awesome',
            'politicians': [1]
        },
        {
            'tweetText': 'John Smith sucks',
            'politicians': [2]
        }
    ]

    expected_data = [
        {
            'sentiment': 0.6248999834060669,
            'politician': 1,
            'sampleSize': 2
        },
        {
            'sentiment': 0.1318499892950058,
            'politician': 2,
            'sampleSize': 2
        }
    ]

    dataframe = spark_context.createDataFrame(test_data)

    ouput_dataframe = analyze(dataframe, politicians).toPandas()
    expected_dataframe = spark_context.createDataFrame(expected_data).toPandas()

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
