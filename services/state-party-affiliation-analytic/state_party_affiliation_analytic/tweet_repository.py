import dask.dataframe as dd
import pandas as pd
from datetime import datetime, timedelta

import boto3
from botocore.client import Config

from dask.dataframe import DataFrame

from state_party_affiliation_analytic.config import config


class TweetRepository:
    _DTYPES = {
        'dateTime': 'datetime64[ns]',
        'democratic': 'float64',
        'republican': 'float64',
        'location': 'object',
        'politicians': 'object',
        'state': 'object',
        'tweetId': 'int64',
        'tweetText': 'object'
    }

    def __init__(self):
        self._storage_options = {
            "key": config.s3_username,
            "secret": config.s3_password,
            "client_kwargs": {
                "endpoint_url": config.s3_url
            }
        }
        self._s3 = boto3.resource('s3',
                                  endpoint_url=config.s3_url,
                                  aws_access_key_id=config.s3_username,
                                  aws_secret_access_key=config.s3_password,
                                  config=Config(signature_version='s3v4'),
                                  region_name='us-east-1')

    def read_tweets(self) -> DataFrame:
        dfs = []

        paths = [self._get_s3_path(i) for i in range(int(config.analytic_lookback_days))]

        for path in paths:
            try:
                current_df = dd.read_json(path, storage_options=self._storage_options)
                dfs.append(current_df)
            # pylint: disable=broad-except
            except Exception:
                print('Error reading path ' + path)

        combined_df = dd.concat(dfs)
        return combined_df

    def write_tweets(self, tweet_dataframe: DataFrame):
        now = datetime.now()
        dd.to_json(tweet_dataframe, f's3://tweets/topics/tweet-created/year={now.year}/'
                                    f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}/'
                                    f'hour={str(now.day).zfill(2)}/*.json',
                   storage_options=self._storage_options)

    def write_analyzed_tweets(self, tweet_dataframe: DataFrame, folder: str):
        tweet_dataframe = TweetRepository._cull_empty_partitions(tweet_dataframe)
        dd.to_json(tweet_dataframe, f's3://{config.s3_analyzed_tweets_bucket}/{folder}/*',
                   storage_options=self._storage_options)

    @staticmethod
    def _cull_empty_partitions(dataframe):
        partitions = list(dataframe.map_partitions(len).compute())
        df_delayed = dataframe.to_delayed()
        df_delayed_new = list()
        pempty = None
        for index, length in enumerate(partitions):
            if length == 0:
                pempty = dataframe.get_partition(index)
            else:
                df_delayed_new.append(df_delayed[index])
        if pempty is not None:
            dataframe = dd.from_delayed(df_delayed_new, meta=pempty)
        return dataframe

    def delete_analyzed_tweets(self, folder: str):
        bucket = self._s3.Bucket(config.s3_analyzed_tweets_bucket)
        bucket.objects.filter(Prefix=f'{folder}/').delete()

    def read_analyzed_tweets(self, folder: str) -> DataFrame:
        try:
            dataframe = dd.read_json(f's3://{config.s3_analyzed_tweets_bucket}/{folder}/*',
                                     storage_options=self._storage_options)
            return dataframe
        # pylint: disable=broad-except
        except Exception as ex:
            print('Error reading analyzed tweets')
            print(ex)
            pandas_dataframe = pd.DataFrame({
                'tweetText': [],
                'location': [],
                'tweetId': [],
                'democratic': [],
                'republican': [],
                'state': []
            }, columns=['tweetText', 'location', 'tweetId', 'republican', 'democratic', 'state'])
            dataframe = dd.from_pandas(pandas_dataframe, npartitions=1)
            return dataframe

    @staticmethod
    def _get_s3_path(offset: int) -> str:
        now = datetime.now()
        now = now - timedelta(days=offset)

        s3_path = f's3://tweets/topics/tweet-created/' \
                  f'year={now.year}/' \
                  f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}/*/*'
        return s3_path
