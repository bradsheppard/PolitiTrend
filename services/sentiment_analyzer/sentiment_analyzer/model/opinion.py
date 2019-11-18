import requests
import json
from dataclasses import dataclass
from sentiment_analyzer.message_bus import MessageBus


@dataclass(init=False)
class Opinion:
    politician: int
    sentiment: int
    tweetId: int
    tweetText: str


@dataclass(init=False)
class OpinionEvent:
    data: Opinion
    type: str


class OpinionRepository:

    def __init__(self):
        self._host = 'http://opinion'
        self._message_bus = MessageBus('queue-kafka', 'opinion')

    def get_all(self):
        res = requests.get(self._host)
        body = res.json()

        opinions = []

        for entry in body:
            opinion = Opinion()
            opinion.sentiment = entry['sentiment']
            opinion.tweetText = entry['tweetText']
            opinion.tweetId = entry['tweetId']
            opinion.politician = entry['politician']

            opinions.append(opinion)

        return opinions

    def insert(self, opinion: Opinion):
        opinion_event = OpinionEvent()
        opinion_event.data = opinion
        opinion_event.type = 'NewOpinion'

        serialized = json.dumps(opinion_event.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))
