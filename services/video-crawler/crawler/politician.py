import requests
from typing import List


class Politician:

    def __init__(self, num, name):
        self.num = num
        self.name = name


class PoliticianRepository:

    def __init__(self):
        self._host = 'http://politician'

    def get_all(self) -> List[Politician]:
        res = requests.get(self._host)
        json = res.json()

        politicians = []

        for entry in json:
            politician = Politician(entry['id'], entry['name'])
            politicians.append(politician)

        return politicians
