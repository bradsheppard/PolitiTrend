from typing import List

import dask.dataframe as dd

from state_party_affiliation_analytic.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer import get_party_sentiments
from state_party_affiliation_analytic.state_lookup import get_state


def get_sentiments_for_partition(dataframe: dd.DataFrame, politicians):
    tweets = dataframe['tweetText']
    sentiments = get_party_sentiments(tweets, politicians)
    return sentiments


def compute_party_sentiments(dataframe: dd.DataFrame,
                             politicians: List[Politician]) -> dd.DataFrame:
    dataframe['sentiment'] = dataframe.map_partitions(get_sentiments_for_partition, politicians)
    dataframe['state'] = dataframe['location'].map(get_state)
    dataframe = dataframe.assign(
        Democratic=dataframe['sentiment'].map(
            lambda x: x['Democratic'] if 'Democratic' in x else 0),
        Republican=dataframe['sentiment'].map(
            lambda x: x['Republican'] if 'Republican' in x else 0)
    )

    dataframe = dataframe.groupby(['state']) \
        .agg({'Democratic': ['count', 'mean'], 'Republican': ['count', 'mean']})

    return dataframe
