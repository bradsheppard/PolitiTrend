from typing import List

from crawler.config import config
from crawler.ml import SentimentAnalyzer
from crawler.model import PoliticianRepository, TweetRepository, OpinionSummaryJobRepository
from crawler.model import TweetCrawler
from crawler.model.politician import Politician
from crawler.orchestrator import CrawlerConfiguration, Orchestrator

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)
tweet_repository = TweetRepository()
tweet_crawler_config = CrawlerConfiguration(crawler=tweet_crawler, repository=tweet_repository,
                                            property_of_interest='tweetText')

opinion_summary_job_repository = OpinionSummaryJobRepository()
sentiment_analyzer = SentimentAnalyzer(list(map(lambda pol: pol.name, politicians)))


orchestrator = Orchestrator([tweet_crawler_config], politicians)

for politician in politicians:
    orchestrator.crawl_all(politician.name)
