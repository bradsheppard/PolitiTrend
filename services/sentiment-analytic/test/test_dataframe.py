# pylint: disable=redefined-outer-name

from typing import List

import pandas as pd
import pytest
from pyspark.sql import SparkSession

from sentiment_analytic.config import load_spark_config
from sentiment_analytic.politician import Politician
from sentiment_analytic.dataframe import analyze, to_politician_sentiment_dataframe, \
    to_party_sentiment_dataframe


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
        },
        {
            'tweetId': '5',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [],
            'dateTime': '2020-11-09 04:57:45'
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


def test_analyze_sentiments(spark_session, politicians, test_data):
    expected_data = [
        {
            'tweetId': '5',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [],
            'politicianSentiments': [],
            'sentiments': [],
            'parties': [],
            'dateTime': '2020-11-09 04:57:45'
        },
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'politicianSentiments': [1],
            'sentiments': [0.9725284576416016],
            'parties': ['Republican'],
            'dateTime': '2020-11-06 04:57:45'
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'politicianSentiments': [2],
            'sentiments': [-0.9567703008651733],
            'parties': ['Democratic'],
            'dateTime': '2020-11-07 04:57:45'
        },
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [0.9760249853134155, 0.9760249853134155],
            'parties': ['Republican', 'Democratic'],
            'dateTime': '2020-11-05 04:57:45'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [-0.9512327313423157, 0.9632722735404968],
            'parties': ['Republican', 'Democratic'],
            'dateTime': '2020-11-08 04:57:45'
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    ouput_dataframe = analyze(dataframe, politicians).toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)


def test_to_politician_sentiment_dataframe(spark_session, politicians, test_data):
    expected_data = [
        {
            'sentiment': 0.3324402372042338,
            'politician': 1,
            'sampleSize': 3
        },
        {
            'sentiment': 0.32750898599624634,
            'politician': 2,
            'sampleSize': 3
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    ouput_dataframe = to_politician_sentiment_dataframe(analyze(dataframe, politicians)).toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)


def test_to_party_sentiment_dataframe(spark_session, politicians, test_data):
    expected_data = [
        {
            'sentiment': 0.3324402372042338,
            'party': 'Republican',
            'sampleSize': 3
        },
        {
            'sentiment': 0.32750898599624634,
            'party': 'Democratic',
            'sampleSize': 3
        }
    ]

    dataframe = spark_session.createDataFrame(test_data)

    ouput_dataframe = to_party_sentiment_dataframe(analyze(dataframe, politicians)).toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, ouput_dataframe, check_like=True, check_dtype=False)
