# pylint: disable=redefined-outer-name

import pytest
import datetime
import time
from datetime import timedelta
import string
import random
from dateutil import parser
from crawler.config import config
from crawler.politician import Politician
from crawler.tweet import TweetRepository, Tweet, TweetCrawler


@pytest.fixture
def tweet_crawler():
    tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret)
    return tweet_crawler


def test_get(tweet_crawler):
    test_politician = Politician(
        1,
        'Donald Trump'
    )

    tweets = tweet_crawler.get(test_politician, [])
    assert len(tweets) == 0


def test_get_with_politicians(tweet_crawler):
    test_politician = Politician(
        1,
        'Donald Trump'
    )

    tweets = tweet_crawler.get(test_politician, [test_politician])
    assert len(tweets) > 0


def test_insert_and_get():
    repository = TweetRepository()
    tomorrow = datetime.datetime.now() + timedelta(days=1)

    tweet = Tweet(
        tweetId='1',
        tweetText=random_string(),
        dateTime=tomorrow.isoformat(' ', 'seconds'),
        politicians=[1],
        location='Test location'
    )

    repository.insert(tweet)

    time.sleep(2)
    inserted_tweets = repository.get_all()

    assert len(inserted_tweets) > 0

    match = False

    for inserted_tweet in inserted_tweets:
        if (
                inserted_tweet.tweetText == tweet.tweetText and
                inserted_tweet.politicians[0] == tweet.politicians[0] and
                parser.parse(inserted_tweet.dateTime).replace(tzinfo=None)
                .isoformat(' ', 'seconds') ==
                parser.parse(tweet.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds')
        ):
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(string_length))
