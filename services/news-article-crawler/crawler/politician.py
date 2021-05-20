from dataclasses import dataclass

import requests

from datetime import datetime, timedelta
from typing import List


@dataclass(frozen=True, eq=True)
class Politician:
    # pylint: disable=invalid-name
    id: int
    name: str
    sampleSize: int


SENTIMENT_HOST = 'http://analytics/politician-sentiment'
POLITICIAN_HOST = 'http://politician'


def get_all() -> List[Politician]:
    politician_names = _get_politicians()
    sentiments = _get_sentiments()

    politicians: List[Politician] = []

    for politician_id in politician_names.keys():
        if politician_id not in sentiments:
            continue

        sample_size = sentiments[politician_id]
        name = politician_names[politician_id]

        politician = Politician(politician_id, name, sample_size)
        politicians.append(politician)

    politicians.sort(key=lambda x: x.sampleSize, reverse=True)
    return politicians


def _get_sentiments():
    now = datetime.now()
    now = now - timedelta(days=2)

    payload = {'resample': 86400000, 'start': now.isoformat()}

    res = requests.get(SENTIMENT_HOST, params=payload)
    json = res.json()

    sentiments = {}

    for entry in json:
        politician_id = entry['politician']
        sample_size = entry['sampleSize']

        sentiments[politician_id] = sample_size

    return sentiments


def _get_politicians():
    res = requests.get(POLITICIAN_HOST)
    json = res.json()['data']

    politicians = {}

    for entry in json:
        politician_id = entry['id']
        name = entry['name']
        politicians[politician_id] = name

    return politicians
