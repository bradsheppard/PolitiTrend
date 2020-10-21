# pylint: disable=redefined-outer-name

from datetime import datetime, timezone

import pytest

from crawler.youtube_video import YoutubeVideo


@pytest.fixture()
def youtube_video():
    youtube_video = YoutubeVideo(
        '123',
        'Test Video',
        'thumb.jps',
        datetime.now(timezone.utc).isoformat(),
        [1, 2],
    )
    return youtube_video
