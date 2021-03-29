from typing import List

import dask.dataframe as dd
import pandas as pd
from functional import seq

from state_party_affiliation_analytic.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer import get_party_sentiments
from state_party_affiliation_analytic.state_lookup import get_state


def get_sentiments_for_partition(dataframe: pd.DataFrame, politicians: List[Politician]):
    tweets: List[str] = []
    entities: List[List[Politician]] = []

    for _, row in dataframe.iterrows():
        tweet = row['tweetText']
        subjects = row['politicians']

        current_subjects: List[Politician] = []

        for subject in subjects:
            candidate_politician = seq(politicians)\
                .find(lambda x, search_id=subject: x.num == search_id)
            current_subjects.append(candidate_politician)

        tweets.append(tweet)
        entities.append(current_subjects)

    sentiments = get_party_sentiments(tweets, entities)
    return sentiments


def compute_party_sentiments(dataframe: dd.DataFrame,
                             politicians: List[Politician]) -> dd.DataFrame:
    dataframe['sentiment'] = dataframe.map_partitions(get_sentiments_for_partition, politicians)
    dataframe['state'] = dataframe['location'].map(get_state)
    dataframe = dataframe.assign(
        democratic=dataframe['sentiment'].map(
            lambda x: x['Democratic'] if 'Democratic' in x else 0),
        republican=dataframe['sentiment'].map(
            lambda x: x['Republican'] if 'Republican' in x else 0)
    )

    dataframe = dataframe.drop('sentiment', axis=1)

    return dataframe


def to_result_dataframe(dataframe: dd.DataFrame) -> dd.DataFrame:
    dataframe = dataframe.groupby(['state']) \
        .agg({'democratic': 'mean', 'republican': 'mean', 'tweetText': 'count'}) \
        .rename(columns={'tweetText': 'count'})
    return dataframe
