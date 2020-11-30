from unittest.mock import Mock, call

from crawler.job import Job
from crawler.orchestrator import Orchestrator
from crawler.politician import Politician


def test_crawl_all(youtube_video):
    mock_youtube_video_repository = Mock()
    mock_youtube_video_crawler = Mock()
    mock_job_repository = Mock()

    mock_job = Job(id=1, politician=2)

    mock_job_repository.get_latest = Mock(return_value=mock_job)
    mock_job_repository.insert = Mock()

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    mock_youtube_video_crawler.get = Mock(return_value=[youtube_video])

    orchestrator = Orchestrator(mock_youtube_video_crawler,
                                mock_youtube_video_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians[0], mock_politicians)

    youtube_video_insert_calls = [call(youtube_video)]

    mock_youtube_video_crawler.get.assert_called_with(mock_politicians[0], mock_politicians)
    mock_youtube_video_repository.insert.assert_has_calls(youtube_video_insert_calls)

    assert mock_job_repository.insert.call_count == 1
