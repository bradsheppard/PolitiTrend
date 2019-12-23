import requests
from attr import dataclass


@dataclass(init=False)
class OpinionSummary:
    id: int
    politician: int
    sentiment: float


class OpinionSummaryRepository:

    def __init__(self):
        self._host = 'http://opinion/opinionsummary'

    def get(self, num: int) -> OpinionSummary:
        res = requests.get(self._host + '/' + str(num))
        response_json = res.json()

        summary = OpinionSummary()
        summary.id = response_json['id']
        summary.politician = response_json['politician']
        summary.sentiment = response_json['sentiment']

        return summary
