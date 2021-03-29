# pylint: disable=redefined-outer-name

import pytest

import dask.dataframe as dd
import pandas as pd
from dask.dataframe import from_pandas

from state_party_affiliation_analytic.dataframe import compute_party_sentiments, to_result_dataframe
from state_party_affiliation_analytic.politician import Politician


@pytest.fixture
def no_entity_dataframe():
    tweet_texts = ['Yup', 'Yessir']
    locations = ['Kentucky', 'New York']
    politicians = [[], []]
    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'politicians': politicians
    }, columns=['tweetText', 'location', 'politicians'])
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
    sentiments = [{'republican': 0.6588}, {'democratic': 0.6588}]
    states = ['KY', 'NY']

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'sentiment': sentiments,
        'state': states,
        'democratic': [0.0, 0.6588],
        'republican': [0.6588, 0.0],
        'politicians': [[1], [2]]
    }, columns=['tweetText', 'location', 'state', 'democratic', 'republican', 'politicians'])

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
        'democratic': [0.0, 0.0],
        'republican': [0.0, 0.0],
        'politicians': [[], []]
    }, columns=['tweetText', 'location', 'state', 'democratic', 'republican', 'politicians'])

    pd.testing.assert_frame_equal(pandas_dataframe, computed_df.compute(),
                                  check_like=True, check_dtype=False)


def test_to_result_dataframe():
    tweet_texts = ['Bob Young is great!', 'John Smith is great!', 'John Smith is okay.']
    locations = ['Kentucky', 'New York', 'New York']
    sentiments = [{'republican': 0.6588}, {'democratic': 1}, {'democratic': 0.5}]
    states = ['KY', 'NY', 'NY']

    pandas_dataframe = pd.DataFrame({
        'tweetText': tweet_texts,
        'location': locations,
        'sentiment': sentiments,
        'state': states,
        'democratic': [0.0, 1, 0.5],
        'republican': [0.6588, 0.0, 0]
    }, columns=['tweetText', 'location', 'state', 'democratic', 'republican'])

    dask_dataframe = from_pandas(pandas_dataframe, npartitions=1)
    result_dataframe = to_result_dataframe(dask_dataframe)

    series = pd.DataFrame([[0, 0.6588, 1], [0.75, 0, 2]],
                          columns=['democratic', 'republican', 'count'],
                          index=['KY', 'NY'])

    pd.testing.assert_frame_equal(series, result_dataframe.compute(), check_like=True,
                                  check_dtype=False)
