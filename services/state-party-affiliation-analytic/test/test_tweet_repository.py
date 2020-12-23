import pytest
import pandas as pd
import dask.dataframe as dd

from state_party_affiliation_analytic.tweet_repository import TweetRepository


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


def test_read_tweets(dataframe):
    tweet_repository = TweetRepository()
    tweet_repository.write_tweets(dataframe)

    resulting_dataframe = tweet_repository.read_tweets()

    pd.testing.assert_frame_equal(dataframe.compute(), resulting_dataframe.compute(),
                                  check_like=True, check_dtype=False)


def test_read_analyzed_tweets(dataframe):
    tweet_repository = TweetRepository()
    tweet_repository.write_analyzed_tweets(dataframe)

    resulting_dataframe = tweet_repository.read_analyzed_tweets()

    pd.testing.assert_frame_equal(dataframe.compute(), resulting_dataframe.compute(),
                                  check_like=True, check_dtype=False)