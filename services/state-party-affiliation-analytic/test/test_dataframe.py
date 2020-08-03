import pytest
import pandas

import dask.dataframe as dd

from state_party_affiliation_analytic.dask.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.model.politician import Politician


@pytest.fixture
def df():
    tweet_texts = ['Bob Young is great!', 'John Smith is great!']
    locations = ['Kentucky', 'New York']
    pandas_df = pandas.DataFrame({
        'tweetText': tweet_texts,
        'location': locations
    }, columns=['tweetText', 'location'])
    df = dd.from_pandas(pandas_df, npartitions=1)
    return df


@pytest.fixture
def politicians():
    politicians = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democratic')
    ]

    return politicians


def test_can_compute_sentiments(df, politicians):
    computed_df = compute_party_sentiments(df, politicians)

    pandas_df = pandas.DataFrame({
        'Democratic': [0, 0.6588],
        'Republican': [0.6588, 0]
    }, columns=['Democratic', 'Republican'], index=['KY', 'NY'])

    pandas.testing.assert_frame_equal(pandas_df, computed_df.compute(), check_like=True, check_dtype=False)
