from typing import List

from crawler.model.job import JobRepository, Job
from crawler.model.politician import Politician
from crawler.model.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository


class Orchestrator:

    def __init__(self,
                 youtube_video_crawler: YoutubeVideoCrawler,
                 youtube_video_respository: YoutubeVideoRepository,
                 job_repository: JobRepository):
        self._youtube_video_crawler = youtube_video_crawler
        self._youtube_video_repository = youtube_video_respository
        self._job_repository = job_repository

    def crawl_all(self, politicians: List[Politician]):
        politician_id = self._job_repository.get_latest().politician

        start_index = next(i for i, politician in enumerate(politicians) if politician.num is politician_id) + 1
        reshaped_politicians = politicians[start_index:] + politicians[:start_index]

        for politician in reshaped_politicians:
            print("Crawling for " + str(politician.num) + " " + politician.name)
            try:
                youtube_videos = self._youtube_video_crawler.get(politician, politicians)
                for youtube_video in youtube_videos:
                    self._youtube_video_repository.insert(youtube_video)
            except:
                print("Exception. Finished at " + str(politician.num) + " " + politician.name)
                return
            finally:
                job = Job(politician=politician.num)
                self._job_repository.insert(job)
