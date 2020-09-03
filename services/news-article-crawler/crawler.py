from typing import List

from crawler.config import config
from crawler.model.news_article import NewsArticleCrawler, NewsArticleRepository
from crawler.model.politician import Politician, PoliticianRepository
from crawler.summarizer.summarizer import Summarizer

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

summarizer = Summarizer()

news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key, summarizer)
news_article_repository = NewsArticleRepository()

for politician in politicians:
    print('Crawling for ' + politician.name)
    try:
        results = news_article_crawler.get(politician, politicians)
        for result in results:
            news_article_repository.insert(result)
    except Exception as ex:
        print('Error occurred while crawling ' + politician.name)
        print(ex)
