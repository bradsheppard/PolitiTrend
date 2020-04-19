import datetime
from unittest.mock import Mock, call
from datetime import datetime, timezone

from crawler.model.job import Job
from crawler.model.politician import Politician
from crawler.model.youtube_video import YoutubeVideo
from crawler.orchestrator import Orchestrator


def test_crawl_all():
    mock_youtube_video_repository = Mock()
    mock_youtube_video_crawler = Mock()
    mock_job_repository = Mock()

    mock_job = Job(id=1, politician=2)

    mock_job_repository.get_latest = Mock(return_value=mock_job)
    mock_job_repository.insert = Mock()

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    crawler_result: YoutubeVideo = YoutubeVideo(
        '123',
        'Test Video',
        'thumb.jps',
        datetime.now(timezone.utc).isoformat(),
        [1, 2],
    )

    mock_youtube_video_crawler.get = Mock(return_value=[crawler_result])

    orchestrator = Orchestrator(mock_youtube_video_crawler, mock_youtube_video_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians)

    youtube_video_insert_calls = [call(crawler_result), call(crawler_result)]

    mock_youtube_video_crawler.get.assert_called_with(mock_politicians[0], mock_politicians)
    mock_youtube_video_repository.insert.assert_has_calls(youtube_video_insert_calls)

    assert mock_job_repository.insert.call_count == 2


def test_crawl_all_on_exception():
    mock_youtube_video_repository = Mock()
    mock_youtube_video_crawler = Mock()
    mock_job_repository = Mock()

    mock_job = Job(id=1, politician=2)

    mock_job_repository.get_latest = Mock(return_value=mock_job)
    mock_job_repository.insert = Mock()

    mock_politicians = [Politician(2, 'Test politician 2'), Politician(3, 'Test politician 3')]

    crawler_result: YoutubeVideo = YoutubeVideo(
        '123',
        'Test Video',
        'thumb.jps',
        datetime.now(timezone.utc).isoformat(),
        [1, 2],
    )

    mock_youtube_video_crawler.get = Mock(side_effect=Exception('Crawling failed'))

    orchestrator = Orchestrator(mock_youtube_video_crawler, mock_youtube_video_repository, mock_job_repository)

    orchestrator.crawl_all(mock_politicians)

    mock_youtube_video_crawler.get.assert_called_with(mock_politicians[1], mock_politicians)
    assert not mock_youtube_video_repository.insert.called

    assert mock_job_repository.insert.call_count == 1
