from datetime import datetime, timedelta
from pyspark.sql import SparkSession, DataFrame
from sentiment_analytic.config import config
from sentiment_analytic.sentiment_analyzer import json_schema


class TweetRepository:

    def __init__(self, spark: SparkSession):
        self._spark = spark

    @staticmethod
    def write_tweets(tweet_dataframe: DataFrame):
        now = datetime.now()
        tweet_dataframe.write.json(f's3a://{config.s3_tweet_bucket}/topics/tweet-created/'
                                   f'year={now.year}/'
                                   f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}',
                                   mode='overwrite')

    @staticmethod
    def write_analyzed_tweets(analyzed_tweets_dataframe: DataFrame, folder: str):
        analyzed_tweets_dataframe \
            .write.json(f's3a://{config.s3_analyzed_tweets_bucket}/{folder}',
                        mode='overwrite')

    def read_tweets(self) -> DataFrame:
        paths = [TweetRepository._get_s3_path(i) for i in range(int(config.analytic_lookback_days))]

        paths = [paths[0]]

        tweets = None

        for path in paths:
            try:
                current_dataframe = self._spark.read.json(path)
                if tweets is None:
                    tweets = current_dataframe
                else:
                    tweets = tweets.union(current_dataframe)
            # pylint: disable=broad-except
            except Exception as ex:
                print(ex)

        return tweets

    def read_analyzed_tweets(self, folder: str) -> DataFrame:
        analyzed_tweets = self._spark.createDataFrame([], json_schema)
        try:
            analyzed_tweets = self._spark.read \
                .json(f's3a://{config.s3_analyzed_tweets_bucket}/{folder}')
        # pylint: disable=broad-except
        except Exception as ex:
            print(ex)

        return analyzed_tweets

    @staticmethod
    def _get_s3_path(offset: int) -> str:
        now = datetime.now()
        now = now - timedelta(days=offset)

        s3_path = f's3a://{config.s3_tweet_bucket}/topics/tweet-created/' \
                  f'year={now.year}/' \
                  f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}/*'
        return s3_path
