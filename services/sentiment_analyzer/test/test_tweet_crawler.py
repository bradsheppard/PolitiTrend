import pytest
from sentiment_analyzer.twitter import TweetCrawler


@pytest.fixture
def tweet_crawler():
    tweet_crawler = TweetCrawler()


def test_get():
    crawler = TweetCrawler()
