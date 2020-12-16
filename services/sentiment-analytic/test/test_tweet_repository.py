# pylint: disable=redefined-outer-name

from typing import List

import pandas as pd
import pytest
from pyspark.sql import SparkSession

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import analyze
from sentiment_analytic.tweet_repository import TweetRepository


@pytest.fixture(scope='session')
def tweet_repository(spark_session: SparkSession):
    reader = TweetRepository(spark_session)
    return reader


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Jim Johnson'),
        Politician(2, 'Jill Smith')
    ]

    return politicians


@pytest.fixture()
def test_data():
    data = [
        {
            'tweetId': '1',
            'tweetText': 'Jim Johnson and Jill Smith are awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-01 04:57:45'
        },
        {
            'tweetId': '2',
            'tweetText': 'Jim Johnson is awesome',
            'politicians': [1],
            'dateTime': '2020-11-02 04:57:45'
        },
        {
            'tweetId': '3',
            'tweetText': 'Jill Smith sucks',
            'politicians': [2],
            'dateTime': '2020-11-03 04:57:45'
        },
        {
            'tweetId': '4',
            'tweetText': 'Jim Johnson sucks. Jill Smith is awesome',
            'politicians': [1, 2],
            'dateTime': '2020-11-04 04:57:45'
        }
    ]

    return data


def test_read_tweets(spark_session, tweet_repository: TweetRepository, test_data):
    dataframe = spark_session.createDataFrame(test_data)
    TweetRepository.write_tweets(dataframe)

    resulting_tweets = tweet_repository.read_tweets().orderBy('dateTime').toPandas()
    expected_dataframe = spark_session.createDataFrame(test_data).orderBy('dateTime').toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)


def test_read_analyzed_tweets(spark_session,
                              tweet_repository: TweetRepository, test_data, politicians):
    dataframe = spark_session.createDataFrame(test_data)
    analyzed_tweets = analyze(dataframe, politicians)

    TweetRepository.write_analyzed_tweets(analyzed_tweets, 'analyzed-tweets')

    resulting_tweets = tweet_repository.read_analyzed_tweets('analyzed-tweets')\
        .orderBy('dateTime').toPandas()
    expected_dataframe = analyzed_tweets.orderBy('dateTime').toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)
