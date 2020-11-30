from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.job import JobRepository
from crawler.orchestrator import Orchestrator
from crawler.politician import Politician, get_all
from crawler.tweet import TweetCrawler, TweetRepository

politicians: List[Politician] = get_all()

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret)
tweet_repository = TweetRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository = JobRepository(session)

latest_jobs = job_repository.get_latest_time_for_politicians(politicians)
sorted_jobs = sorted(latest_jobs.items(), key=lambda x: x[1])

orchestrator = Orchestrator(tweet_crawler, tweet_repository, job_repository)
batch_size = config.crawler_size
i = 1

for politician, job in sorted_jobs:
    if i > batch_size:
        break

    print('Crawling for ' + politician.name)
    orchestrator.crawl_all(politician, politicians)

    i = i + 1
