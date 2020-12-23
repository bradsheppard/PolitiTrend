# pylint: disable=redefined-outer-name

import pytest

import dask.dataframe as dd
import pandas as pd

from state_party_affiliation_analytic.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.politician import Politician


@pytest.fixture
def dataframe():
    tweet_texts = ['Bob Young is great!', 'John Smith is great!']
    locations = ['Kentucky', 'New York']
    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations
    }, columns=['tweetText', 'location'])
    dataframe = dd.from_pandas(pandas_dataframe, npartitions=1)
    return dataframe


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

    tweet_texts = ['Yup', 'Yessir']
    locations = ['Kentucky', 'New York']
    sentiments = [1.9, 1.2]

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'sentiment': sentiments
    }, columns=['tweetText', 'location', 'sentiment'])

    pd.testing.assert_frame_equal(pandas_dataframe, computed_df.compute(),
                                  check_like=True, check_dtype=False)
