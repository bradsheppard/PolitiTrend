from dataclasses import dataclass

import requests
from typing import List


@dataclass()
class Politician:
    num: int
    name: str


HOST = 'http://politician'


def get_all() -> List[Politician]:
    res = requests.get(HOST)
    json = res.json()

    politicians = []

    for entry in json:
        politician = Politician(entry['id'], entry['name'])
        politicians.append(politician)

    return politicians
