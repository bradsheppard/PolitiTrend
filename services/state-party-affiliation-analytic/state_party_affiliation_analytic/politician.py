from dataclasses import dataclass
import requests
from typing import List


@dataclass(frozen=True, eq=True)
class Politician:
    num: int
    name: str
    party: str


class PoliticianRepository:

    def __init__(self):
        self._host = 'http://politician'

    def get_all(self) -> List[Politician]:
        res = requests.get(self._host)
        json = res.json()

        politicians = []

        for entry in json:
            politician = Politician(entry['id'], entry['name'], entry['party'])
            politicians.append(politician)

        return politicians
