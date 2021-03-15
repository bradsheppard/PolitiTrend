from dataclasses import dataclass, field

import requests
from typing import List


@dataclass(unsafe_hash=True)
class Politician:
    # pylint: disable=invalid-name
    num: int = field(hash=True)
    name: str = field(hash=True)


HOST = 'http://politician'


def get_all() -> List[Politician]:
    res = requests.get(HOST)
    json = res.json()['data']

    politicians = []

    for entry in json:
        politician = Politician(entry['id'], entry['name'])
        politicians.append(politician)

    return politicians
