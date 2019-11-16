import pytest
from sentiment_analyzer.twitter import TweetCrawler
import configparser


@pytest.fixture
def tweet_crawler():
    config = configparser.ConfigParser()
    config.read('../config.ini')
    twitter_config = config['twitter']
    tweet_crawler = TweetCrawler(twitter_config['consumer_key'], twitter_config['consumer_secret'],
                                 twitter_config['access_token'], twitter_config['access_token_secret'])
    return tweet_crawler


def test_get(tweet_crawler):
    tweets = tweet_crawler.get('Donald Trump')
    assert len(tweets) > 0
