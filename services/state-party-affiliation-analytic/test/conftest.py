# pylint: disable=redefined-outer-name

import dask.dataframe as dd
import pytest
import pandas as pd


@pytest.fixture()
def index():
    arrays = [
        ['Democratic', 'Democratic', 'Republican', 'Republican'],
        ['count', 'mean', 'count', 'mean']
    ]
    tuples = list(zip(*arrays))

    index = pd.MultiIndex.from_tuples(tuples)
    return index


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