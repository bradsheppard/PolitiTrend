import datetime
from dataclasses import dataclass
from unittest.mock import Mock
from crawler.model import Opinion, Sentiment
from crawler.model.politician import Politician
from crawler.orchestrator import Orchestrator, CrawlerConfiguration


def test_crawl_all():
    @dataclass
    class TestOpinionType(Opinion):
        text: str

    mock_repository = Mock()
    mock_crawler = Mock()
    mock_politician = Politician(1, 'Test politician')

    crawler_result: TestOpinionType = TestOpinionType(
        [],
        datetime.datetime.now().isoformat(' ', 'seconds'),
        'Test text')

    mock_crawler.get = Mock(return_value=[crawler_result])

    crawler_configuration = CrawlerConfiguration(
        crawler=mock_crawler,
        repository=mock_repository,
        property_of_interest='text')
    orchestrator = Orchestrator([crawler_configuration], [mock_politician])

    orchestrator.crawl_all('Test term')

    mock_crawler.get.assert_called_once_with('Test term')
    mock_repository.insert.assert_called_once()
