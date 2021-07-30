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


@pytest.mark.forked
def test_analyze_sentiments(spark_session: SparkSession,
                            politicians: List[Politician], test_data):
    expected_data = [
        {
            'tweetId': '1',
            'tweetText': 'Bob Young and John Smith are awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [0.9998767375946045, 0.9998767375946045],
            'parties': ['Republican', 'Democratic'],
            'dateTime': '2020-11-05 04:57:45',
            'state': 'NY'
        },
        {
            'tweetId': '2',
            'tweetText': 'Bob Young is awesome',
            'politicians': [1],
            'politicianSentiments': [1],
            'sentiments': [0.9998750686645508],
            'parties': ['Republican'],
            'dateTime': '2020-11-06 04:57:45',
            'state': None
        },
        {
            'tweetId': '3',
            'tweetText': 'John Smith sucks',
            'politicians': [2],
            'politicianSentiments': [2],
            'sentiments': [-0.9967911839485168],
            'parties': ['Democratic'],
            'dateTime': '2020-11-07 04:57:45',
            'state': 'VT'
        },
        {
            'tweetId': '4',
            'tweetText': 'Bob Young sucks. John Smith is awesome',
            'politicians': [1, 2],
            'politicianSentiments': [1, 2],
            'sentiments': [-0.9992656111717224, 0.999874472618103],
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


@pytest.mark.forked
def test_to_politician_sentiment_dataframe(spark_session: SparkSession,
                                           politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_politician_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        (1, 0.3334953983624776, 3),
        (2, 0.3343200087547302, 3)
    ], ['politician', 'sentiment', 'sampleSize'])

    assert expected_dataframe.collect() == output_dataframe.collect()


@pytest.mark.forked
def test_to_party_sentiment_dataframe(spark_session: SparkSession,
                                      politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_party_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        ('Republican', 0.3334953983624776, 3),
        ('Democratic', 0.3343200087547302, 3)
    ], ['party', 'sentiment', 'sampleSize'])

    assert expected_dataframe.collect() == output_dataframe.collect()


@pytest.mark.forked
def test_to_state_sentiment_dataframe(spark_session: SparkSession,
                                      politicians: List[Politician], test_data):
    dataframe = spark_session.createDataFrame(test_data)

    output_dataframe = to_state_sentiment_dataframe(analyze(dataframe, politicians))
    expected_dataframe = spark_session.createDataFrame([
        ('VT', 1, Row(democratic=-0.9967911839485168, republican=0.0)),
        ('NY', 2, Row(democratic=0.9998756051063538, republican=0.00030556321144104004))
    ], ['state', 'sampleSize', 'affiliations'])

    assert expected_dataframe.collect() == output_dataframe.collect()
