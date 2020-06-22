import dask.dataframe as dd
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from state_party_affiliation_analytic.common.path_translator import get_s3_path
from state_party_affiliation_analytic.model.politician import PoliticianRepository
from state_party_affiliation_analytic.sentiment_analyzer.sentiment_analyzer import get_entity_sentiments

pd.set_option('display.max_colwidth', None)
pd.set_option('display.max_columns', None)

sentiment_analyzer = SentimentIntensityAnalyzer()

path = get_s3_path(0)
politician_repository = PoliticianRepository()
politicians = politician_repository.get_all()

df = dd.read_json(path, storage_options={
    "key": "brad1234",
    "secret": "brad1234",
    "client_kwargs": {
        "endpoint_url": "http://minio:9000"
    }
})


def compute_sentiment(statement: str):
    return get_entity_sentiments(statement, politicians)


df['sentiment'] = df['tweetText'].map(compute_sentiment)

print(df.head(40))
