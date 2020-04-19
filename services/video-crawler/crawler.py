from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.model.job import JobRepository, Job
from crawler.model.politician import PoliticianRepository, Politician
from crawler.model.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository
from crawler.orchestrator import Orchestrator

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

youtube_video_crawler: YoutubeVideoCrawler = YoutubeVideoCrawler(config.api_key)
youtube_repository: YoutubeVideoRepository = YoutubeVideoRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository: JobRepository = JobRepository(session)
orchestrator = Orchestrator(youtube_video_crawler, youtube_repository, job_repository)

orchestrator.crawl_all(politicians)
