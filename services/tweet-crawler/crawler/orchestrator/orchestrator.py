from typing import List
from dataclasses import dataclass
from crawler.ml import SentimentAnalyzer
from crawler.model.crawler import Crawler
from crawler.model.politician import Politician
from crawler.model.sentiment import Sentiment
from crawler.model.tweet import TweetRepository, TweetCrawler


@dataclass
class CrawlerConfiguration:
    crawler: Crawler
    repository: TweetRepository
    property_of_interest: str


class Orchestrator:

    def __init__(self, tweet_crawler: TweetCrawler, tweet_respository: TweetRepository, politicians: List[Politician]):
        self._tweet_crawler = tweet_crawler
        self._tweet_repository = tweet_respository
        self._sentiment_analyzer = SentimentAnalyzer(subjects=list(map(lambda x: x.name, politicians)))
        self._politicians = politicians

    def crawl_all(self, search_term: str):
        results = self._tweet_crawler.get(search_term)
        for result in results:
            analysis_result = self._sentiment_analyzer.analyze(result.tweetText)
            for subject_result in analysis_result.subjectResults.keys():
                sentiment = Sentiment(
                    politician=self._lookup_politician_id(subject_result),
                    value=analysis_result.subjectResults[subject_result])
                result.sentiments.append(sentiment)
            self._tweet_repository.insert(result)

    def _lookup_politician_id(self, name) -> int:
        politician = list(filter(lambda x: x.name == name, self._politicians))
        if len(politician) > 0:
            return politician[0].num
