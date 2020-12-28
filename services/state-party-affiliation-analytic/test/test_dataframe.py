# pylint: disable=redefined-outer-name

import pytest

import dask.dataframe as dd
import pandas as pd

from state_party_affiliation_analytic.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.politician import Politician


@pytest.fixture
def no_entity_dataframe():
    tweet_texts = ['Yup', 'Yessir']
    locations = ['Kentucky', 'New York']
    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations
    }, columns=['tweetText', 'location'])
    dataframe = dd.from_pandas(pandas_dataframe, npartitions=1)
    return dataframe


@pytest.fixture
def politicians():
    politicians = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democratic')
    ]

    return politicians


def test_can_compute_sentiments(dataframe, politicians):
    computed_df = compute_party_sentiments(dataframe, politicians)

    tweet_texts = ['Bob Young is great!', 'John Smith is great!']
    locations = ['Kentucky', 'New York']
    sentiments = [{'Republican': 0.6588}, {'Democratic': 0.6588}]
    states = ['KY', 'NY']

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'sentiment': sentiments,
        'state': states,
        'Democratic': [0.0, 0.6588],
        'Republican': [0.6588, 0.0]
    }, columns=['tweetText', 'location', 'sentiment', 'state', 'Democratic', 'Republican'])

    pd.testing.assert_frame_equal(pandas_dataframe, computed_df.compute(),
                                  check_like=True, check_dtype=False)


def test_can_compute_sentiment_no_entity(no_entity_dataframe, politicians):
    computed_df = compute_party_sentiments(no_entity_dataframe, politicians)

    tweet_texts = ['Yup', 'Yessir']
    locations = ['Kentucky', 'New York']
    sentiments = [{}, {}]
    states = ['KY', 'NY']

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'sentiment': sentiments,
        'state': states,
        'Democratic': [0.0, 0.0],
        'Republican': [0.0, 0.0]
    }, columns=['tweetText', 'location', 'sentiment', 'state', 'Democratic', 'Republican'])

    pd.testing.assert_frame_equal(pandas_dataframe, computed_df.compute(),
                                  check_like=True, check_dtype=False)
