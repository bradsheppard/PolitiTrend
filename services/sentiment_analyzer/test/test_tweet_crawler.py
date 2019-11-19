import pytest
from sentiment_analyzer.config import config
from sentiment_analyzer.twitter import TweetCrawler


@pytest.fixture
def tweet_crawler():
    tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                                 config.twitter_access_token, config.twitter_access_token_secret)
    return tweet_crawler


def test_get(tweet_crawler):
    tweets = tweet_crawler.get('Donald Trump')
    assert len(tweets) > 0
