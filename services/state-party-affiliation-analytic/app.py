import dask.dataframe as dd
import pandas as pd

from dask.distributed import Client

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from state_party_affiliation_analytic.common.path_translator import get_s3_path
from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.dataframe.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.model.politician import PoliticianRepository

if __name__ == "__main__":

    client = Client()

    pd.set_option('display.max_colwidth', None)
    pd.set_option('display.max_columns', None)

    sentiment_analyzer = SentimentIntensityAnalyzer()

    paths = [get_s3_path(0), get_s3_path(1), get_s3_path(2)]

    politician_repository = PoliticianRepository()
    politicians = politician_repository.get_all()

    storage_options = {
        "key": config.s3_username,
        "secret": config.s3_password,
        "client_kwargs": {
            "endpoint_url": config.s3_url
        }
    }

    dfs = []

    for path in paths:
        try:
            df = dd.read_json(path, storage_options=storage_options)
            dfs.append(df)
        except Exception:
            print('Error reading path ' + path)

    combined_df = dd.concat(dfs)

    result = compute_party_sentiments(combined_df, politicians)

    print(result.head(40))
