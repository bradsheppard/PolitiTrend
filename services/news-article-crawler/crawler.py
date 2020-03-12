from typing import List

from crawler.config import config
from crawler.ml import SentimentAnalyzer
from crawler.model.news_article import NewsArticleCrawler, NewsArticleRepository
from crawler.model.politician import Politician, PoliticianRepository
from crawler.orchestrator import CrawlerConfiguration, Orchestrator

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key)
news_article_repository = NewsArticleRepository()
news_article_config = CrawlerConfiguration(crawler=news_article_crawler, repository=news_article_repository,
                                           property_of_interest='title')

sentiment_analyzer = SentimentAnalyzer(list(map(lambda pol: pol.name, politicians)))


orchestrator = Orchestrator([news_article_config], politicians)

for politician in politicians:
    print('Crawling for ' + politician.name)
    orchestrator.crawl_all(politician.name)
