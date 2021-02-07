import json
from dataclasses import dataclass
from typing import List

import requests
import re

from crawler.message_bus import MessageBus
from crawler.politician import Politician
from crawler.summarizer import Summarizer


@dataclass
class NewsArticle:
    politicians: List[int]
    dateTime: str
    image: str
    title: str
    url: str
    source: str
    description: str
    summary: str


class NewsArticleRepository:

    def __init__(self, message_bus: MessageBus):
        self._host = 'http://news-article'
        self._message_bus = message_bus

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
                politicians=entry['politicians'],
                dateTime=entry['dateTime'],
                description=entry['description'],
                source=entry['source'],
                summary=entry['summary']
            )

            news_articles.append(news_article)

        return news_articles


class NewsArticleCrawler:

    _url = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI'

    def __init__(self, api_key: str, summarizer: Summarizer):
        self._headers = {
            'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
            'x-rapidapi-key': api_key
        }
        self._summarizer = summarizer

    def _get_summaries(self, news_articles):
        stripped_body = list(map(self._get_body, news_articles))
        summaries = self._summarizer.summarize_all(stripped_body)
        return summaries

    @staticmethod
    def _get_body(article):
        stripped_body = NewsArticleCrawler._stip_html_tags(article['body'])
        return stripped_body

    def get(self, politician: Politician, politicians: List[Politician]) -> List[NewsArticle]:
        querystring = {'autoCorrect': 'false', 'pageNumber': '1', 'pageSize': '20', 'q': politician.name,
                       'safeSearch': 'false'}
        response = requests.request('GET', self._url, headers=self._headers, params=querystring)
        body = json.loads(response.text)

        articles = body['value']
        results = []

        summaries = self._get_summaries(articles)

        for index, article in enumerate(articles):
            extracted_politicians = self.extract_politicians(
                article['title'] + article['description'] + article['body'], politicians)

            stripped_description = NewsArticleCrawler._stip_html_tags(article['description'])
            summary = summaries[index]

            if summary is None:
                continue

            if len(extracted_politicians) == 0:
                extracted_politicians = [politician.num]

            news_article = NewsArticle(
                title=NewsArticleCrawler._stip_html_tags(article['title']),
                url=article['url'],
                image=article['image']['url'],
                politicians=extracted_politicians,
                dateTime=article['datePublished'],
                source=article['provider']['name'],
                description=stripped_description,
                summary=summary
            )
            results.append(news_article)

        return results

    @staticmethod
    def extract_politicians(text: str, politicians: List[Politician]) -> List[int]:
        results = []
        for politician in politicians:
            if politician.name in text:
                results.append(politician.num)

        return results

    @staticmethod
    def _stip_html_tags(value: str):
        return re.sub('<[^<]+?>', '', value)
