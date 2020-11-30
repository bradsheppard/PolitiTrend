from typing import List

from crawler.job import JobRepository, Job
from crawler.politician import Politician
from crawler.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository


class Orchestrator:
    # pylint: disable=too-few-public-methods
    def __init__(self,
                 youtube_video_crawler: YoutubeVideoCrawler,
                 youtube_video_respository: YoutubeVideoRepository,
                 job_repository: JobRepository):
        self._youtube_video_crawler = youtube_video_crawler
        self._youtube_video_repository = youtube_video_respository
        self._job_repository = job_repository

    def crawl_all(self, politician: Politician, politicians: List[Politician]):
        youtube_videos = self._youtube_video_crawler.get(politician, politicians)
        for youtube_video in youtube_videos:
            self._youtube_video_repository.insert(youtube_video)
        job = Job(politician=politician.num)
        self._job_repository.insert(job)
