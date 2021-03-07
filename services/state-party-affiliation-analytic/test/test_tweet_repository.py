# pylint: disable=redefined-outer-name

import pandas as pd

from state_party_affiliation_analytic.tweet_repository import TweetRepository


def test_read_tweets(dataframe):
    tweet_repository = TweetRepository()
    tweet_repository.write_tweets(dataframe)

    resulting_dataframe = tweet_repository.read_tweets()

    pd.testing.assert_frame_equal(dataframe.compute(), resulting_dataframe.compute(),
                                  check_like=True, check_dtype=False)


def test_read_analyzed_tweets(dataframe):
    tweet_repository = TweetRepository()
    tweet_repository.write_analyzed_tweets(dataframe, 'test')

    resulting_dataframe = tweet_repository.read_analyzed_tweets('test')

    pd.testing.assert_frame_equal(dataframe.compute(), resulting_dataframe.compute(),
                                  check_like=True, check_dtype=False)


def test_delete_analyzed_tweets(dataframe):
    tweet_repository = TweetRepository()

    tweet_repository.write_analyzed_tweets(dataframe, 'test')
    tweet_repository.delete_analyzed_tweets('test')

    resulting_dataframe = tweet_repository.read_analyzed_tweets('test')

    pd.testing.assert_frame_equal(pd.DataFrame({},
                                               columns=['tweetText', 'location', 'tweetId',
                                                        'state', 'democratic', 'republican']),
                                  resulting_dataframe.compute(), check_like=True, check_dtype=False)
