from typing import List, Union

from crawler.job import JobRepository, Job
from crawler.politician import Politician
from crawler.tweet import TweetRepository, TweetCrawler


class Orchestrator:
    # pylint: disable=too-few-public-methods
    def __init__(self,
                 tweet_crawler: TweetCrawler,
                 tweet_respository: TweetRepository,
                 job_repository: JobRepository):
        self._tweet_crawler = tweet_crawler
        self._tweet_repository = tweet_respository
        self._job_repository = job_repository

    def crawl_all(self, politician: Politician, politicians: List[Politician]):
        job = self._job_repository.get_latest_for_politician(politician.num)

        min_tweet_id = job.maxTweetId if job is not None else '1'

        results = self._tweet_crawler.get(
            politician,
            politicians,
            min_tweet_id=min_tweet_id)

        for result in results:
            self._tweet_repository.insert(result)

        max_tweet_id = max((tweet.tweetId for tweet in results), default=min_tweet_id)
        new_job = Job(minTweetId=min_tweet_id, maxTweetId=max_tweet_id, politician=politician.num)
        self._job_repository.insert(new_job)

    @staticmethod
    def _lookup_politician_id(name, politicians: List[Politician]) -> Union[None, int]:
        politician = list(filter(lambda x: x.name == name, politicians))
        if len(politician) > 0:
            return politician[0].num
        return None
