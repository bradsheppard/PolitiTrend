from typing import List

from crawler.model.news_article import NewsArticleRepository, NewsArticleCrawler
from crawler.model.politician import Politician


class Orchestrator:

    def __init__(self, news_article_repository: NewsArticleRepository, news_article_crawler: NewsArticleCrawler):
        self._news_article_repository = news_article_repository
        self._news_article_crawler = news_article_crawler

    def crawl_all(self, politician: Politician, politicians: List[Politician]):
        results = self._news_article_crawler.get(politician, politicians)
        for result in results:
            self._news_article_repository.insert(result)
