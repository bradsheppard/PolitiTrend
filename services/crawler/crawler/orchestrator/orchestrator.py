from typing import List
from dataclasses import dataclass
from crawler.ml import SentimentAnalyzer
from crawler.model import Crawler, Repository, Sentiment
from crawler.model.politician import Politician


@dataclass
class CrawlerConfiguration:
    crawler: Crawler
    repository: Repository
    property_of_interest: str


class Orchestrator:

    def __init__(self, crawler_configurations: List[CrawlerConfiguration], politicians: List[Politician]):
        self._crawler_configurations = crawler_configurations
        self._sentiment_analyzer = SentimentAnalyzer(subjects=list(map(lambda x: x.name, politicians)))
        self._politicians = politicians

    def crawl_all(self, search_term: str):
        for configuration in self._crawler_configurations:
            results = configuration.crawler.get(search_term)
            for result in results:
                analysis_result = self._sentiment_analyzer.analyze(result[configuration.property_of_interest])
                for subject_result in analysis_result.subjectResults.keys():
                    sentiment = Sentiment(
                        politician=self._lookup_politician_id(subject_result),
                        value=analysis_result.subjectResults[subject_result])
                    result.sentiments.append(sentiment)

    def _lookup_politician_id(self, name) -> int:
        politician = list(filter(lambda x: x.name == name, self._politicians))
        if len(politician) > 0:
            return politician[0].num
