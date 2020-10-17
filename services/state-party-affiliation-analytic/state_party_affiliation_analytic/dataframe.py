from typing import List

import dask.dataframe as dd

from state_party_affiliation_analytic.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer import get_party_sentiments
from state_party_affiliation_analytic.state_lookup import get_state


def get_sentiments_for_partition(df: dd.DataFrame, politicians):
    tweets = df['tweetText']
    sentiments = get_party_sentiments(tweets, politicians)
    return sentiments


def compute_party_sentiments(df: dd.DataFrame, politicians: List[Politician]) -> dd.DataFrame:
    df['sentiment'] = df.map_partitions(get_sentiments_for_partition, politicians)
    df['state'] = df['location'].map(get_state)
    df = df.assign(
        Democratic=df['sentiment'].map(lambda x: x['Democratic'] if 'Democratic' in x else 0),
        Republican=df['sentiment'].map(lambda x: x['Republican'] if 'Republican' in x else 0)
    )

    df = df.groupby(['state']) \
        .agg({'Democratic': ['count', 'mean'], 'Republican': ['count', 'mean']})

    return df
