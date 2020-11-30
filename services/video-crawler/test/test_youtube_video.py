# pylint: disable=redefined-outer-name

import time

import pytest

from crawler.config import config
from crawler.politician import Politician
from crawler.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository


@pytest.fixture
def youtube_video_crawler():
    youtube_video_crawler = YoutubeVideoCrawler(config.youtube_api_key)
    return youtube_video_crawler


def test_get(youtube_video_crawler: YoutubeVideoCrawler):
    test_politician = Politician(1, 'Donald Trump')
    youtube_videos = youtube_video_crawler.get(test_politician, [test_politician])

    assert len(youtube_videos) > 0


def test_insert_and_get(youtube_video):
    repository = YoutubeVideoRepository()

    repository.insert(youtube_video)

    time.sleep(2)
    inserted_youtube_videos = repository.get_all()

    assert len(inserted_youtube_videos) > 0
    assert youtube_video == inserted_youtube_videos[0]
