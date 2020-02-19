from typing import List

from crawler.config import config
from crawler.ml import SentimentAnalyzer
from crawler.model.news_article import NewsArticleCrawler, NewsArticleRepository
from crawler.model.opinion_summary_job import OpinionSummaryJobRepository, OpinionSummaryJob
from crawler.model.politician import Politician, PoliticianRepository
from crawler.model.tweet import TweetCrawler, TweetRepository
from crawler.orchestrator import CrawlerConfiguration, Orchestrator

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)
tweet_repository = TweetRepository()
tweet_config = CrawlerConfiguration(crawler=tweet_crawler, repository=tweet_repository,
                                    property_of_interest='tweetText')
news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key)
news_article_repository = NewsArticleRepository()
news_article_config = CrawlerConfiguration(crawler=news_article_crawler, repository=news_article_repository,
                                           property_of_interest='title')

opinion_summary_job_repository = OpinionSummaryJobRepository()
sentiment_analyzer = SentimentAnalyzer(list(map(lambda pol: pol.name, politicians)))


orchestrator = Orchestrator([tweet_config, news_article_config], politicians)

for politician in politicians:
    print('Crawling for ' + politician.name)
    orchestrator.crawl_all(politician.name)
    opinion_summary_job = OpinionSummaryJob()
    opinion_summary_job.politician = politician.num
    opinion_summary_job_repository.insert(opinion_summary_job)
