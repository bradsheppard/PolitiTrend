from typing import List

from crawler.job import JobRepository, Job
from crawler.politician import Politician
from crawler.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository


class Orchestrator:

    def __init__(self,
                 youtube_video_crawler: YoutubeVideoCrawler,
                 youtube_video_respository: YoutubeVideoRepository,
                 job_repository: JobRepository):
        self._youtube_video_crawler = youtube_video_crawler
        self._youtube_video_repository = youtube_video_respository
        self._job_repository = job_repository

    def crawl_all(self, politicians: List[Politician]):
        latest_job = self._job_repository.get_latest()
        politician_id = latest_job.politician if latest_job is not None else politicians[0].num

        start_index = next(i for i, politician in enumerate(politicians) if politician.num is politician_id) + 1
        reshaped_politicians = politicians[start_index:] + politicians[:start_index]

        for politician in reshaped_politicians:
            print("Crawling for " + str(politician.num) + " " + politician.name)
            try:
                youtube_videos = self._youtube_video_crawler.get(politician, politicians)
                for youtube_video in youtube_videos:
                    self._youtube_video_repository.insert(youtube_video)
                job = Job(politician=politician.num)
                self._job_repository.insert(job)
            except Exception as ex:
                print("Exception. Finished at " + str(politician.num) + " " + politician.name)
                print(ex)
                return
