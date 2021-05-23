# pylint: disable=redefined-outer-name
from typing import List

import pandas as pd
import pytest
from pyspark import Row
from pyspark.sql import SparkSession

from sentiment_analytic.config import load_spark_config
from sentiment_analytic.dataframe import analyze, to_politician_sentiment_dataframe, \
    to_party_sentiment_dataframe, to_state_sentiment_dataframe
from sentiment_analytic.politician import Politician


@pytest.fixture()
def test_data():
    data = [
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-05 04:57:45',
            'location': 'Somewhere, NY'
        },
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'dateTime': '2020-11-06 04:57:45',
            'location': ''
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'dateTime': '2020-11-07 04:57:45',
            'location': 'Somewhere, VT'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-08 04:57:45',
            'location': 'Somewhere, NY'
        },
        {
            'tweetId': '5',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [],
            'dateTime': '2020-11-09 04:57:45',
            'location': 'Somewhere, NY'
        }
    ]

    return data


@pytest.fixture(scope='module')
def spark_session():
    spark_session = SparkSession.builder\
        .master("local[1]")\
        .getOrCreate()

    load_spark_config(spark_session.sparkContext)

    yield spark_session

    spark_session.stop()


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democratic')
    ]

    return politicians


def test_analyze_sentiments(spark_session: SparkSession,
                            politicians: List[Politician], test_data):
    expected_data = [
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [0.9760249853134155, 0.9760249853134155],
            'parties': ['Republican', 'Democratic'],
            'dateTime': '2020-11-05 04:57:45',
            'state': 'NY'
        },
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'politicianSentiments': [1],
            'sentiments': [0.9725284576416016],
            'parties': ['Republican'],
            'dateTime': '2020-11-06 04:57:45',
            'state': None
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'politicianSentiments': [2],
            'sentiments': [-0.9567703008651733],
            'parties': ['Democratic'],
            'dateTime': '2020-11-07 04:57:45',
            'state': 'VT'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [-0.9512327313423157, 0.9632722735404968],
            'parties': ['Republican', 'Democratic'],
            'dateTime': '2020-11-08 04:57:45',
            'state': 'NY'
        },
        {
            'tweetId': '5',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [],
            'politicianSentiments': [],
            'sentiments': [],
            'parties': [],
            'dateTime': '2020-11-09 04:57:45',
            'state': 'NY'
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = analyze(dataframe, politicians).toPandas()
    expected_dataframe = pd.DataFrame(expected_data)

    pd.testing.assert_frame_equal(
        expected_dataframe, output_dataframe, check_like=True, check_dtype=False)


def test_to_politician_sentiment_dataframe(spark_session: SparkSession,
                                           politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_politician_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        (1, 0.3324402372042338, 3),
        (2, 0.32750898599624634, 3)
    ], ['politician', 'sentiment', 'sampleSize'])

    assert expected_dataframe.collect() == output_dataframe.collect()


def test_to_party_sentiment_dataframe(spark_session: SparkSession,
                                      politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_party_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        ('Republican', 0.3324402372042338, 3),
        ('Democratic', 0.32750898599624634, 3)
    ], ['party', 'sentiment', 'sampleSize'])

    assert expected_dataframe.collect() == output_dataframe.collect()


def test_to_state_sentiment_dataframe(spark_session: SparkSession,
                                      politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_state_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        ('VT', 1, Row(democratic=-0.9567703008651733, republican=0.0)),
        ('NY', 2, Row(democratic=0.9696486294269562, republican=0.012396126985549927))
    ], ['state', 'sampleSize', 'affiliations'])

    assert expected_dataframe.collect() == output_dataframe.collect()
