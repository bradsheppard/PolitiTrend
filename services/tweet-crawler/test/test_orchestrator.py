import datetime
from dataclasses import dataclass
from typing import List
from unittest.mock import Mock

from crawler.model.politician import Politician
from crawler.model.tweet import Sentiment
from crawler.orchestrator import Orchestrator, CrawlerConfiguration


def test_crawl_all():
    @dataclass
    class TestOpinionType:
        sentiments: List[Sentiment]
        datetime: str
        text: str

    mock_repository = Mock()
    mock_crawler = Mock()
    mock_politician = Politician(1, 'Test politician')

    crawler_result: TestOpinionType = TestOpinionType(
        [],
        datetime.datetime.now().isoformat(' ', 'seconds'),
        text='Test text')

    mock_crawler.get = Mock(return_value=[crawler_result])

    crawler_configuration = CrawlerConfiguration(
        crawler=mock_crawler,
        repository=mock_repository,
        property_of_interest='text')
    orchestrator = Orchestrator([crawler_configuration], [mock_politician])

    orchestrator.crawl_all('Test term')

    mock_crawler.get.assert_called_once_with('Test term')
    mock_repository.insert.assert_called_once()
