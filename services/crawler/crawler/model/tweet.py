from typing import List
import requests
import json
from dataclasses import dataclass
from crawler.message_bus import MessageBus


@dataclass(init=False)
class Sentiment:
    politician: int
    value: float


@dataclass(init=False)
class Tweet:
    tweetId: str
    tweetText: str
    sentiments: List[Sentiment]


class TweetRepository:

    def __init__(self):
        self._host = 'http://opinion/tweet'
        self._message_bus = MessageBus('queue-kafka', 'tweet_created')

    def get_all(self):
        res = requests.get(self._host)
        body = res.json()

        tweets = []

        for entry in body:
            tweet = Tweet()
            tweet.sentiments = entry['sentiments']
            tweet.tweetText = entry['tweetText']
            tweet.tweetId = entry['tweetId']

            tweets.append(tweet)

        return tweets

    def insert(self, tweet: Tweet):
        serialized = json.dumps(tweet.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))
