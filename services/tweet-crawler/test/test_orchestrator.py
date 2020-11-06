import datetime
from unittest.mock import Mock

from crawler.job import Job
from crawler.politician import Politician
from crawler.tweet import Tweet
from crawler.orchestrator import Orchestrator


def test_crawl_all():
    mock_tweet_repository = Mock()
    mock_tweet_crawler = Mock()
    mock_job_repository = Mock()

    mock_job = Job(id=1, minTweetId='10', maxTweetId='20')

    mock_job_repository.get_latest_for_politician = Mock(return_value=mock_job)

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    crawler_result: Tweet = Tweet(
        [],
        datetime.datetime.now().isoformat(' ', 'seconds'),
        '123',
        'Test text',
        'Test location')

    mock_tweet_crawler.get = Mock(return_value=[crawler_result])

    orchestrator = Orchestrator(mock_tweet_crawler, mock_tweet_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians[0], mock_politicians)

    mock_tweet_crawler.get.assert_called_once_with(
        mock_politicians[0], mock_politicians, min_tweet_id='20')
    mock_tweet_repository.insert.assert_called_once()


def test_crawl_all_no_results():
    mock_tweet_repository = Mock()
    mock_tweet_crawler = Mock()
    mock_job_repository = Mock()

    mock_job = Job(id=1, minTweetId='10', maxTweetId='20')

    mock_job_repository.get_latest_for_politician = Mock(return_value=mock_job)

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    mock_tweet_crawler.get = Mock(return_value=[])

    orchestrator = Orchestrator(mock_tweet_crawler, mock_tweet_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians[0], mock_politicians)

    mock_tweet_crawler.get.assert_called_once_with(
        mock_politicians[0], mock_politicians, min_tweet_id='20')
    mock_tweet_repository.insert.assert_not_called()


def test_crawl_all_no_job():
    mock_tweet_repository = Mock()
    mock_tweet_crawler = Mock()
    mock_job_repository = Mock()

    mock_job_repository.get_latest_for_politician = Mock(return_value=None)

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    crawler_result: Tweet = Tweet(
        [],
        datetime.datetime.now().isoformat(' ', 'seconds'),
        '123',
        'Test text',
        'Test location')

    mock_tweet_crawler.get = Mock(return_value=[crawler_result])

    orchestrator = Orchestrator(mock_tweet_crawler, mock_tweet_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians[0], mock_politicians)

    mock_tweet_crawler.get.assert_called_once_with(
        mock_politicians[0], mock_politicians, min_tweet_id='1')
    mock_tweet_repository.insert.assert_called_once()
