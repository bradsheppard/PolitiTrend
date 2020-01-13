import time
import string
import random
from crawler.model import TweetRepository, Tweet, Sentiment


def test_insert_and_get():
    repository = TweetRepository()
    tweet = Tweet()
    sentiment = Sentiment()
    sentiment.politician = 1
    sentiment.value = 1
    tweet.politician = 1
    tweet.tweetId = 1
    tweet.tweetText = random_string()
    tweet.sentiments = [sentiment]

    repository.insert(tweet)

    time.sleep(2)
    inserted_tweets = repository.get_all()

    assert len(inserted_tweets) > 0

    match = False

    for inserted_tweet in inserted_tweets:
        if inserted_tweet.tweetText == tweet.tweetText:
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
