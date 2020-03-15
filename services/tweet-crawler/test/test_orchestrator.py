import datetime
from unittest.mock import Mock

from crawler.model.politician import Politician
from crawler.model.tweet import Tweet
from crawler.orchestrator import Orchestrator


def test_crawl_all():
    mock_repository = Mock()
    mock_crawler = Mock()
    mock_politician = Politician(1, 'Test politician')

    crawler_result: Tweet = Tweet(
        [],
        datetime.datetime.now().isoformat(' ', 'seconds'),
        '123',
        'Test text')

    mock_crawler.get = Mock(return_value=[crawler_result])

    orchestrator = Orchestrator(mock_crawler, mock_repository, [mock_politician])

    orchestrator.crawl_all('Test term')

    mock_crawler.get.assert_called_once_with('Test term')
    mock_repository.insert.assert_called_once()
