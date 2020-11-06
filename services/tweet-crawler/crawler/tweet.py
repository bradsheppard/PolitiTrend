import json
from dataclasses import dataclass
from typing import List

import requests
import tweepy

from crawler.message_bus import MessageBus
from crawler.politician import Politician


@dataclass
class Tweet:
    # pylint: disable=invalid-name
    politicians: List[int]
    dateTime: str
    tweetId: str
    tweetText: str
    location: str


class TweetCrawler:

    def __init__(self, consumer_key: str, consumer_secret: str):
        auth = tweepy.AppAuthHandler(consumer_key, consumer_secret)
        self._api = tweepy.API(auth)

    def get(self, politician: Politician, politicians: List[Politician], **kwargs) -> List[Tweet]:
        tweepy_results = tweepy\
            .Cursor(self._api.search, q=politician.name, lang='en', result_type='mixed',
                    tweet_mode='extended', count=100, api_root='/2',
                    since_id=kwargs.get('min_tweet_id'), max_id=kwargs.get('max_tweet_id')) \
            .items(100)

        results = []

        for tweepy_result in tweepy_results:
            extracted_politicians = self.extract_politicians(tweepy_result.full_text, politicians)

            if len(extracted_politicians) == 0:
                continue

            tweet = Tweet(
                tweetId=tweepy_result.id_str,
                tweetText=tweepy_result.full_text,
                dateTime=tweepy_result.created_at.isoformat(' ', 'seconds'),
                politicians=extracted_politicians,
                location=tweepy_result.user.location
            )

            results.append(tweet)

        return results

    @staticmethod
    def extract_politicians(text: str, politicians: List[Politician]) -> List[int]:
        results = []
        for politician in politicians:
            if politician.name in text:
                results.append(politician.num)

        return results


class TweetRepository:

    def __init__(self):
        self._host = 'http://tweet'
        self._message_bus = MessageBus('queue-kafka-bootstrap', 'tweet-created')

    def get_all(self):
        res = requests.get(self._host)
        body = res.json()

        tweets = []

        for entry in body:
            tweet = Tweet(
                politicians=entry['politicians'],
                tweetText=entry['tweetText'],
                tweetId=entry['tweetId'],
                dateTime=entry['dateTime'],
                location=entry['location'])

            tweets.append(tweet)

        return tweets

    def insert(self, tweet: Tweet):
        serialized = json.dumps(tweet.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))
