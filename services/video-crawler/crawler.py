from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.job import JobRepository
from crawler.orchestrator import Orchestrator
from crawler.politician import PoliticianRepository, Politician
from crawler.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

youtube_video_crawler = YoutubeVideoCrawler(config.api_key)
youtube_repository = YoutubeVideoRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository: JobRepository = JobRepository(session)
orchestrator = Orchestrator(youtube_video_crawler,
                            youtube_repository, job_repository)

orchestrator.crawl_all(politicians)
