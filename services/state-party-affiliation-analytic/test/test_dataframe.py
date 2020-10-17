import pytest
import pandas

import dask.dataframe as dd
import pandas as pd

from state_party_affiliation_analytic.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.politician import Politician


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

    arrays = [['Democratic', 'Democratic', 'Republican', 'Republican'], ['count', 'mean', 'count', 'mean']]
    tuples = list(zip(*arrays))

    index = pd.MultiIndex.from_tuples(tuples)

    pandas_df = pd.DataFrame([[1, 0, 1, 0.6588], [1, 0.6588, 1, 0]], columns=index, index=['KY', 'NY'])

    pandas.testing.assert_frame_equal(pandas_df, computed_df.compute(), check_like=True, check_dtype=False)
