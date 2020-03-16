from typing import List

from crawler.ml import SentimentAnalyzer
from crawler.model.job import JobRepository, Job
from crawler.model.politician import Politician
from crawler.model.sentiment import Sentiment
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

        sentiment_analyzer = SentimentAnalyzer(subjects=list(map(lambda x: x.name, politicians)))
        results = self._tweet_crawler.get(
            politician.name,
            min_tweet_id=max_tweet_id)

        for result in results:
            analysis_result = sentiment_analyzer.analyze(result.tweetText)
            for subject_result in analysis_result.subjectResults.keys():
                sentiment = Sentiment(
                    politician=self._lookup_politician_id(subject_result, politicians),
                    value=analysis_result.subjectResults[subject_result])
                result.sentiments.append(sentiment)
            self._tweet_repository.insert(result)

        if len(results) == 0:
            return

        max_id = max(tweet.tweetId for tweet in results)
        new_job = Job(minTweetId=max_tweet_id, maxTweetId=max_id, politician=politician.num)
        self._job_repository.insert(new_job)

    @staticmethod
    def _lookup_politician_id(name, politicians: List[Politician]) -> int:
        politician = list(filter(lambda x: x.name == name, politicians))
        if len(politician) > 0:
            return politician[0].num
