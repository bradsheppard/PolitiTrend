import dask.dataframe as dd
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from state_party_affiliation_analytic.common.path_translator import get_s3_path
from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.dataframe.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.model.politician import PoliticianRepository

pd.set_option('display.max_colwidth', None)
pd.set_option('display.max_columns', None)

sentiment_analyzer = SentimentIntensityAnalyzer()

path = get_s3_path(1)
politician_repository = PoliticianRepository()
politicians = politician_repository.get_all()

df = dd.read_json(path, storage_options={
    "key": config.s3_username,
    "secret": config.s3_password,
    "client_kwargs": {
        "endpoint_url": config.s3_url
    }
})

result = compute_party_sentiments(df, politicians)

print(df.head(40))
