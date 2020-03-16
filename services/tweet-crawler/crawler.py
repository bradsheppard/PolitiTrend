from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.model.job import JobRepository
from crawler.model.politician import Politician, PoliticianRepository
from crawler.model.tweet import TweetCrawler, TweetRepository
from crawler.orchestrator import Orchestrator

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)
tweet_repository = TweetRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository = JobRepository(session)

orchestrator = Orchestrator(tweet_crawler, tweet_repository, job_repository)

for politician in politicians:
    print('Crawling for ' + politician.name)
    orchestrator.crawl_all(politician, politicians)
