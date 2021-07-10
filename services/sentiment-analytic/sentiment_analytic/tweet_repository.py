from datetime import datetime, timedelta
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col

from sentiment_analytic.config import config
from sentiment_analytic.dataframe import json_schema


class TweetRepository:

    def __init__(self, spark: SparkSession):
        self._spark = spark

    @staticmethod
    def write_tweets(tweet_dataframe: DataFrame):
        tweet_dataframe \
            .write \
            .partitionBy('year', 'month', 'day', 'hour') \
            .json(f's3a://{config.s3_tweet_bucket}/topics/tweet-created', mode='overwrite')

    @staticmethod
    def write_analyzed_tweets(analyzed_tweets_dataframe: DataFrame, folder: str):
        analyzed_tweets_dataframe \
            .write.json(f's3a://{config.s3_analyzed_tweets_bucket}/{folder}',
                        mode='overwrite')

    def read_tweets(self, lookback: int) -> DataFrame:
        now = datetime.now()
        start = now - timedelta(days=lookback)

        start_month = str(start.month).zfill(2)
        start_day = str(start.day).zfill(2)
        start_hour = str(start.hour).zfill(2)
        start_year = str(start.year)

        dataframe = self._spark.read.json(f's3a://{config.s3_tweet_bucket}/topics/tweet-created')
        dataframe = dataframe.filter((col('year') > start_year) |
                                     ((col('year') == start_year) & (col('month') > start_month)) |
                                     ((col('year') == start_year) & (col('month') == start_month) &
                                      (col('day') > start_day)) |
                                     ((col('year') == start_year) & (col('month') == start_month)
                                      & (col('day') == start_day) &
                                      (col('hour') > start_hour)))

        return dataframe

    def read_analyzed_tweets(self, folder: str) -> DataFrame:
        analyzed_tweets = self._spark.createDataFrame([], json_schema)
        try:
            analyzed_tweets = self._spark.read \
                .json(f's3a://{config.s3_analyzed_tweets_bucket}/{folder}')
        # pylint: disable=broad-except
        except Exception as ex:
            print(ex)

        return analyzed_tweets
