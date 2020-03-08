import json
from dataclasses import dataclass
from typing import List

import requests
import re

from crawler.message_bus import MessageBus
from crawler.model.crawler import Crawler
from crawler.model.repository import Repository
from crawler.model.sentiment import Sentiment


@dataclass
class NewsArticle:
    sentiments: List[Sentiment]
    dateTime: str
    image: str
    title: str
    url: str
    source: str
    description: str


class NewsArticleRepository(Repository[NewsArticle]):

    def __init__(self):
        self._host = 'http://news-article'
        self._message_bus = MessageBus('queue-kafka-bootstrap', 'news-article-created')

    def insert(self, news_article: NewsArticle):
        serialized = json.dumps(news_article.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))

    def get_all(self) -> List[NewsArticle]:
        res = requests.get(self._host)
        body = res.json()

        news_articles = []

        for entry in body:
            news_article = NewsArticle(
                title=entry['title'],
                url=entry['url'],
                image=entry['image'],
                sentiments=entry['sentiments'],
                dateTime=entry['dateTime'],
                description=entry['description'],
                source=entry['source']
            )

            news_articles.append(news_article)

        return news_articles


class NewsArticleCrawler(Crawler[NewsArticle]):

    _url = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI'

    def __init__(self, api_key: str):
        self._headers = {
            'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
            'x-rapidapi-key': api_key
        }

    def get(self, search_term) -> List[NewsArticle]:
        querystring = {'autoCorrect': 'false', 'pageNumber': '1', 'pageSize': '10', 'q': search_term,
                       'safeSearch': 'false'}
        response = requests.request('GET', self._url, headers=self._headers, params=querystring)
        body = json.loads(response.text)

        articles = body['value']
        results = []

        for article in articles:
            news_article = NewsArticle(
                title=NewsArticleCrawler._stip_html_tags(article['title']),
                url=article['url'],
                image=article['image']['url'],
                sentiments=[],
                dateTime=article['datePublished'],
                source=article['provider']['name'],
                description=NewsArticleCrawler._stip_html_tags(article['description'])
            )
            results.append(news_article)

        return results

    @staticmethod
    def _stip_html_tags(value: str):
        return re.sub('<[^<]+?>', '', value)
