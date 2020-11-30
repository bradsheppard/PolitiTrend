"""
Main file for kicking off the crawler job
"""

from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.job import JobRepository
from crawler.orchestrator import Orchestrator
from crawler.politician import get_all, Politician
from crawler.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository

politicians: List[Politician] = get_all()

youtube_video_crawler = YoutubeVideoCrawler(config.youtube_api_key)
youtube_repository = YoutubeVideoRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository: JobRepository = JobRepository(session)
orchestrator = Orchestrator(youtube_video_crawler,
                            youtube_repository, job_repository)

latest_jobs = job_repository.get_latest_time_for_politicians(politicians)
sorted_jobs = sorted(latest_jobs.items(), key=lambda x: x[1])

batch_size = config.crawler_size
i = 1

for politician, job in sorted_jobs:
    if i > batch_size:
        break

    print('Crawling for ' + politician.name)
    try:
        orchestrator.crawl_all(politician, politicians)
    # pylint: disable=broad-except
    except Exception as ex:
        print('Exception occurred with ' + politician.name)
        break

    i = i + 1
