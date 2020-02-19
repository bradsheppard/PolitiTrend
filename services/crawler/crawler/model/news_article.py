import requests


class NewsCrawler:

    _url = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI'

    def __init__(self, api_key: str):
        self._headers = {
            'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
            'x-rapidapi-key': api_key
        }

    def get(self, search_term):
        querystring = {'autoCorrect': 'false', 'pageNumber': '1', 'pageSize': '10', 'q': search_term,
                       'safeSearch': 'false'}
        response = requests.request('GET', self._url, headers=self._headers, params=querystring)
        return response.text
