# pylint: disable=redefined-outer-name

from typing import List

import pandas as pd
import pytest
from pyspark.sql import SparkSession

from sentiment_analytic.config import load_spark_config
from sentiment_analytic.politician import Politician
from sentiment_analytic.tweet_repository import TweetRepository


@pytest.fixture()
def tweet_repository(spark_session: SparkSession):
    reader = TweetRepository(spark_session)
    return reader


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Jim Johnson', 'Republican'),
        Politician(2, 'Jill Smith', 'Democratic')
    ]

    return politicians


@pytest.fixture(scope='module')
def spark_session():
    spark_session = SparkSession.builder\
        .master("local[1]")\
        .getOrCreate()

    load_spark_config(spark_session.sparkContext)

    yield spark_session

    spark_session.stop()


@pytest.fixture()
def test_data():
    data = [
        {
            'tweetId': '1',
            'tweetText': 'Jim Johnson and Jill Smith are awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-01 04:57:45',
            'year': 2020,
            'month': 11,
            'day': 1,
            'hour': 4
        },
        {
            'tweetId': '2',
            'tweetText': 'Jim Johnson is awesome',
            'politicians': [1],
            'dateTime': '2020-11-02 04:57:45',
            'year': 2020,
            'month': 11,
            'day': 2,
            'hour': 4
        },
        {
            'tweetId': '3',
            'tweetText': 'Jill Smith sucks',
            'politicians': [2],
            'dateTime': '2020-11-03 04:57:45',
            'year': 2020,
            'month': 11,
            'day': 3,
            'hour': 4
        },
        {
            'tweetId': '4',
            'tweetText': 'Jim Johnson sucks. Jill Smith is awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-04 04:57:45',
            'year': 2020,
            'month': 11,
            'day': 4,
            'hour': 4
        }
    ]

    return data


def test_read_tweets(spark_session, tweet_repository: TweetRepository, test_data):
    dataframe = spark_session.createDataFrame(test_data)
    TweetRepository.write_tweets(dataframe)

    resulting_tweets = tweet_repository.read_tweets(99999).orderBy('dateTime').toPandas()
    expected_dataframe = spark_session.createDataFrame(test_data).orderBy('dateTime').toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)


def test_read_analyzed_tweets(spark_session,
                              tweet_repository: TweetRepository, test_data):
    dataframe = spark_session.createDataFrame(test_data)

    TweetRepository.write_analyzed_tweets(dataframe, 'analyzed-tweets')

    resulting_tweets = tweet_repository.read_analyzed_tweets('analyzed-tweets')\
        .orderBy('dateTime').toPandas()
    expected_dataframe = dataframe.orderBy('dateTime').toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)
