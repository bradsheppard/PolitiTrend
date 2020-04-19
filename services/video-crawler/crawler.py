from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.model.job import JobRepository, Job
from crawler.model.politician import PoliticianRepository, Politician
from crawler.model.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

youtube_video_crawler: YoutubeVideoCrawler = YoutubeVideoCrawler(config.api_key)
youtube_repository: YoutubeVideoRepository = YoutubeVideoRepository()

engine = create_engine(config.sql_connection_string)
session_maker = sessionmaker(bind=engine)
session = session_maker()

job_repository: JobRepository = JobRepository(session)
politician_id = job_repository.get_latest().politician + 1

start_index = next(i for i, politician in enumerate(politicians) if politician.num is politician_id) + 1
reshaped_politicians = politicians[start_index:] + politicians[:start_index]

for politician in reshaped_politicians:
    print("Crawling for " + str(politician.num) + " " + politician.name)
    try:
        youtube_videos = youtube_video_crawler.get(politician, politicians)
        for youtube_video in youtube_videos:
            youtube_repository.insert(youtube_video)
    except:
        job = Job(politician=politician.num)
        job_repository.insert(job)
