# pylint: disable=redefined-outer-name
from datetime import datetime, timedelta
from typing import List

import pandas as pd
import pytest
from pyspark.sql import SparkSession

from sentiment_analytic.config import load_spark_config
from sentiment_analytic.politician import Politician
from sentiment_analytic.tweet_service import TweetService


@pytest.fixture()
def tweet_service(spark_session: SparkSession):
    reader = TweetService(spark_session)
    return reader


@pytest.fixture
def politicians():
    politicians: List[Politician] = [
        Politician(1, 'Jim Johnson', 'Republican'),
        Politician(2, 'Jill Smith', 'Democratic')
    ]

    return politicians


@pytest.fixture()
def current_time():
    return datetime.now()


@pytest.fixture(scope='module')
def spark_session():
    spark_session = SparkSession.builder\
        .master("local[1]")\
        .getOrCreate()

    load_spark_config(spark_session.sparkContext)

    yield spark_session

    spark_session.stop()


@pytest.fixture()
def test_data(current_time):
    two_days_ago = current_time - timedelta(days=2)
    one_day_ago = current_time - timedelta(days=1)

    data = [
        {
            'tweetId': '1',
            'tweetText': 'Jim Johnson and Jill Smith are awesome',
            'politicians': [1, 2],
            'dateTime': two_days_ago.isoformat(),
            'year': two_days_ago.year,
            'month': str(two_days_ago.month).zfill(2),
            'day': str(two_days_ago.day).zfill(2),
            'hour': str(two_days_ago.hour).zfill(2)
        },
        {
            'tweetId': '2',
            'tweetText': 'Jim Johnson is awesome',
            'politicians': [1],
            'dateTime': two_days_ago.isoformat(),
            'year': two_days_ago.year,
            'month': str(two_days_ago.month).zfill(2),
            'day': str(two_days_ago.day).zfill(2),
            'hour': str(two_days_ago.hour).zfill(2)
        },
        {
            'tweetId': '3',
            'tweetText': 'Jill Smith sucks',
            'politicians': [2],
            'dateTime': one_day_ago.isoformat(),
            'year': one_day_ago.year,
            'month': str(one_day_ago.month).zfill(2),
            'day': str(one_day_ago.day).zfill(2),
            'hour': str(one_day_ago.hour).zfill(2)
        },
        {
            'tweetId': '4',
            'tweetText': 'Jim Johnson sucks. Jill Smith is awesome',
            'politicians': [1, 2],
            'dateTime': one_day_ago.isoformat(),
            'year': one_day_ago.year,
            'month': str(one_day_ago.month).zfill(2),
            'day': str(one_day_ago.day).zfill(2),
            'hour': str(one_day_ago.hour).zfill(2)
        }
    ]

    return data


@pytest.fixture()
def expected_data(current_time):
    two_days_ago = current_time - timedelta(days=2)
    one_day_ago = current_time - timedelta(days=1)

    data = [
        {
            'tweetId': '1',
            'tweetText': 'Jim Johnson and Jill Smith are awesome',
            'politicians': [1, 2],
            'dateTime': two_days_ago.isoformat()
        },
        {
            'tweetId': '2',
            'tweetText': 'Jim Johnson is awesome',
            'politicians': [1],
            'dateTime': two_days_ago.isoformat()
        },
        {
            'tweetId': '3',
            'tweetText': 'Jill Smith sucks',
            'politicians': [2],
            'dateTime': one_day_ago.isoformat()
        },
        {
            'tweetId': '4',
            'tweetText': 'Jim Johnson sucks. Jill Smith is awesome',
            'politicians': [1, 2],
            'dateTime': one_day_ago.isoformat()
        }
    ]

    return data


@pytest.mark.forked
def test_read_tweets(spark_session, tweet_service: TweetService, test_data, expected_data):
    dataframe = spark_session.createDataFrame(test_data)
    TweetService.write_tweets(dataframe)

    resulting_tweets = tweet_service.read_tweets(4).orderBy('dateTime').toPandas()
    expected_dataframe = spark_session.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)


@pytest.mark.forked
def test_read_analyzed_tweets(spark_session,
                              tweet_service: TweetService, test_data):
    dataframe = spark_session.createDataFrame(test_data)

    TweetService.write_analyzed_tweets(dataframe, 'analyzed-tweets')

    resulting_tweets = tweet_service.read_analyzed_tweets('analyzed-tweets')\
        .orderBy('dateTime').toPandas()
    expected_dataframe = dataframe.orderBy('dateTime').toPandas()

    pd.testing.assert_frame_equal(
        expected_dataframe, resulting_tweets, check_like=True, check_dtype=False)
