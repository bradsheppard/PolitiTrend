import requests


class PoliticianRepository:

    def __init__(self):
        self.host = 'http://politician'

    def get_all(self):
        res = requests.get(self.host)
        json = res.json()

        politicians = []

        for entry in json:
            politician = Politician(entry['id'], entry['name'])
            politicians.append(politician)

        return politicians


class Politician:

    def __init__(self, num, name):
        self.num = num
        self.name = name
