from datetime import datetime, timedelta
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col

from sentiment_analytic.config import config
from sentiment_analytic.dataframe import json_schema


class TweetService:

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
        paths = [TweetService._get_s3_path(i) for i in range(lookback)]

        dataframe = None

        for path in paths:
            try:
                current_dataframe = self._spark.read.json(path)
                if dataframe is None:
                    dataframe = current_dataframe
                else:
                    dataframe = dataframe.union(current_dataframe)
            # pylint: disable=broad-except
            except Exception as ex:
                print(ex)

        now = datetime.now()
        start = now - timedelta(days=lookback)

        dataframe = dataframe.filter(col('dateTime') >= start)

        return dataframe

    @staticmethod
    def _get_s3_path(offset: int) -> str:
        now = datetime.now()
        now = now - timedelta(days=offset)

        s3_path = f's3a://{config.s3_tweet_bucket}/topics/tweet-created/' \
                  f'year={now.year}/' \
                  f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}/*'
        return s3_path

    def read_analyzed_tweets(self, folder: str) -> DataFrame:
        analyzed_tweets = self._spark.createDataFrame([], json_schema)
        try:
            analyzed_tweets = self._spark.read \
                .json(f's3a://{config.s3_analyzed_tweets_bucket}/{folder}')
        # pylint: disable=broad-except
        except Exception as ex:
            print(ex)

        return analyzed_tweets
