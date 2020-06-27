import dask.dataframe as dd
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from state_party_affiliation_analytic.common.path_translator import get_s3_path
from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.model.politician import PoliticianRepository
from state_party_affiliation_analytic.sentiment_analyzer.sentiment_analyzer import get_entity_sentiments
from state_party_affiliation_analytic.state_lookup import get_state

pd.set_option('display.max_colwidth', None)
pd.set_option('display.max_columns', None)

sentiment_analyzer = SentimentIntensityAnalyzer()

path = get_s3_path(0)
politician_repository = PoliticianRepository()
politicians = politician_repository.get_all()

df = dd.read_json(path, storage_options={
    "key": config.s3_username,
    "secret": config.s3_password,
    "client_kwargs": {
        "endpoint_url": config.s3_url
    }
})

df['sentiment'] = df['tweetText'].map(lambda x: get_entity_sentiments(x, politicians))
df['state'] = df['location'].map(get_state)
# df = df.explode('sentiment')

print(df.head(40))
