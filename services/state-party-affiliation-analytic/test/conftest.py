# pylint: disable=redefined-outer-name

import dask.dataframe as dd
import pytest
import pandas as pd


@pytest.fixture
def dataframe():
    tweet_texts = ['Bob Young is great!', 'John Smith is great!',
                   'Bob Young and John Smith are great!', 'Yup']
    locations = ['Kentucky', 'New York', 'New York', 'New York']
    politicians = [[1], [2], [1, 2], []]

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'politicians': politicians
    }, columns=['tweetText', 'location', 'politicians'])

    dataframe = dd.from_pandas(pandas_dataframe, npartitions=1)
    return dataframe
