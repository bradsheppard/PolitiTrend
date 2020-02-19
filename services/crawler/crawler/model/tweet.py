import json
from dataclasses import dataclass
from typing import List

import requests
import tweepy

from crawler.message_bus import MessageBus
from crawler.model.crawler import Crawler
from crawler.model.opinion import Opinion
from crawler.model.repository import Repository


@dataclass
class Tweet(Opinion):
    tweetId: str
    tweetText: str


class TweetCrawler(Crawler[Tweet]):

    def __init__(self, consumer_key: str, consumer_secret: str, access_token: str, access_token_secret: str):
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)

        self._api = tweepy.API(auth)

    def get(self, search_term: str) -> List[Tweet]:
        results = tweepy\
            .Cursor(self._api.search, q=search_term, lang='en', result_type='mixed',
                    tweet_mode='extended', count=100) \
            .items(100)

        return [Tweet(
            tweetId=result.id_str,
            tweetText=result.full_text,
            dateTime=result.created_at.isoformat(' ', 'seconds'),
            sentiments=[]) for result in results]


class TweetRepository(Repository[Tweet]):

    def __init__(self):
        self._host = 'http://opinion/tweet'
        self._message_bus = MessageBus('queue-kafka', 'tweet_created')

    def get_all(self):
        res = requests.get(self._host)
        body = res.json()

        tweets = []

        for entry in body:
            tweet = Tweet(
                sentiments=entry['sentiments'],
                tweetText=entry['tweetText'],
                tweetId=entry['tweetId'],
                dateTime=entry['dateTime'])

            tweets.append(tweet)

        return tweets

    def insert(self, tweet: Tweet):
        serialized = json.dumps(tweet.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))
