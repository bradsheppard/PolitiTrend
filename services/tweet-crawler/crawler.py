from typing import List

from crawler.config import config
from crawler.ml import SentimentAnalyzer
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

sentiment_analyzer = SentimentAnalyzer(list(map(lambda pol: pol.name, politicians)))


orchestrator = Orchestrator([tweet_config], politicians)

for politician in politicians:
    print('Crawling for ' + politician.name)
    orchestrator.crawl_all(politician.name)
