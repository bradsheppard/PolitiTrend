from typing import List

from crawler.model.job import JobRepository, Job
from crawler.model.politician import Politician
from crawler.model.tweet import TweetRepository, TweetCrawler


class Orchestrator:

    def __init__(self,
                 tweet_crawler: TweetCrawler,
                 tweet_respository: TweetRepository,
                 job_repository: JobRepository):
        self._tweet_crawler = tweet_crawler
        self._tweet_repository = tweet_respository
        self._job_repository = job_repository

    def crawl_all(self, politician: Politician, politicians: List[Politician]):
        job = self._job_repository.get_latest_for_politician(politician.num)

        max_tweet_id = job.maxTweetId if job is not None else '1'

        results = self._tweet_crawler.get(
            politician,
            politicians,
            min_tweet_id=max_tweet_id)

        if len(results) == 0:
            return

        for result in results:
            self._tweet_repository.insert(result)

        max_id = max(tweet.tweetId for tweet in results)
        new_job = Job(minTweetId=max_tweet_id, maxTweetId=max_id, politician=politician.num)
        self._job_repository.insert(new_job)

    @staticmethod
    def _lookup_politician_id(name, politicians: List[Politician]) -> int:
        politician = list(filter(lambda x: x.name == name, politicians))
        if len(politician) > 0:
            return politician[0].num
