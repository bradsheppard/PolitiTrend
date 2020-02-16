from typing import List
from dataclasses import dataclass
from crawler.model import Crawler, Repository


@dataclass
class CrawlerConfiguration:
    crawler: Crawler
    repository: Repository


class Orchestrator:

    def __init__(self, crawler_configurations: List[CrawlerConfiguration]):
        self._crawler_configurations = crawler_configurations

    def crawl_all(self, search_term: str):
        for configuration in self._crawler_configurations:
            results = configuration.crawler.get(search_term)
            for result in results:
                configuration.repository.insert(result)
