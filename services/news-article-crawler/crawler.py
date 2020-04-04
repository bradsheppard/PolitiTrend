from typing import List

from crawler.config import config
from crawler.model.news_article import NewsArticleCrawler, NewsArticleRepository
from crawler.model.politician import Politician, PoliticianRepository

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key)
news_article_repository = NewsArticleRepository()

for politician in politicians:
    print('Crawling for ' + politician.name)
    results = news_article_crawler.get(politician, politicians)
    for result in results:
        news_article_repository.insert(result)
