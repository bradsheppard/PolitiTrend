from unittest.mock import Mock
from crawler.orchestrator import Orchestrator, CrawlerConfiguration


def test_crawl_all():
    mock_repository = Mock()
    mock_crawler = Mock()

    crawler_result = {'text': 'test'}

    mock_crawler.get = Mock(return_value=crawler_result)

    crawler_configuration = CrawlerConfiguration(crawler=mock_crawler, repository=mock_repository)
    orchestrator = Orchestrator([crawler_configuration])

    orchestrator.crawl_all('Test term')

    mock_crawler.get.assert_called_once_with('Test term')
    mock_repository.insert.assert_called_once()
