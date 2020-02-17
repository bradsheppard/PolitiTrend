import pytest
import datetime
import time
import string
import random
from dateutil import parser
from crawler.config import config
from crawler.model import TweetRepository, Tweet, TweetCrawler
from crawler.model.opinion import Sentiment


@pytest.fixture
def tweet_crawler():
    tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                                 config.twitter_access_token, config.twitter_access_token_secret)
    return tweet_crawler


def test_get(tweet_crawler):
    tweets = tweet_crawler.get('Donald Trump')
    assert len(tweets) > 0


def test_insert_and_get():
    repository = TweetRepository()

    sentiment = Sentiment(
        politician=1,
        value=1
    )

    tweet = Tweet(
        tweetId='1',
        tweetText=random_string(),
        dateTime=datetime.datetime.now().isoformat(' ', 'seconds'),
        sentiments=[sentiment]
    )

    repository.insert(tweet)

    time.sleep(2)
    inserted_tweets = repository.get_all()

    assert len(inserted_tweets) > 0

    match = False

    for inserted_tweet in inserted_tweets:
        if (
                inserted_tweet.tweetText == tweet.tweetText and
                inserted_tweet.sentiments[0]['value'] == tweet.sentiments[0].value and
                inserted_tweet.sentiments[0]['politician'] == tweet.sentiments[0].politician and
                parser.parse(inserted_tweet.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds') ==
                parser.parse(tweet.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds')
        ):
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
