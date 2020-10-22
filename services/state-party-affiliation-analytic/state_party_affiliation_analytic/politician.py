from dataclasses import dataclass
import requests
from typing import List


@dataclass(frozen=True, eq=True)
class Politician:
    num: int
    name: str
    party: str


HOST = 'http://politician'


def get_all() -> List[Politician]:
    res = requests.get(HOST)
    json = res.json()

    politicians = []

    for entry in json:
        politician = Politician(entry['id'], entry['name'], entry['party'])
        politicians.append(politician)

    return politicians
