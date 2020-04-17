import requests
import json
from typing import List
from dataclasses import dataclass
from crawler.message_bus import MessageBus
from crawler.model.politician import Politician


@dataclass()
class YoutubeVideo:
    videoId: str
    title: str
    politicians: List[int]


class YoutubeVideoRepository:

    def __init__(self):
        self._host = 'http://video/youtube'
        self._message_bus = MessageBus('queue-kafka-bootstrap', 'video-youtube-video-created')

    def get_all(self) -> List[YoutubeVideo]:
        res = requests.get(self._host)
        body = res.json()

        youtube_videos = []

        for entry in body:
            youtube_video = YoutubeVideo(
                videoId=entry['videoId'],
                title=entry['title'],
                politicians=entry['politicians']
            )

            youtube_videos.append(youtube_video)

        return youtube_videos

    def insert(self, youtube_video: YoutubeVideo):
        serialized = json.dumps(youtube_video.__dict__, default=lambda o: o.__dict__)
        self._message_bus.send(str.encode(serialized))


class YoutubeVideoCrawler:

    _url = 'https://www.googleapis.com/youtube/v3/search'

    def __init__(self, api_key):
        self._api_key = api_key
        self._headers = {
            'Accept': 'application/json'
        }

    def get(self, politician: Politician, politicians: List[Politician]) -> List[YoutubeVideo]:
        querystring = {
            'type': 'video',
            'q': politician.name,
            'key': self._api_key,
            'part': 'snippet',
            'maxResults': 50
        }
        response = requests.request('GET', self._url, headers=self._headers, params=querystring)
        body = json.loads(response.text)

        youtube_videos = []

        for item in body['items']:
            title = item['snippet']['title']

            youtube_video = YoutubeVideo(
                videoId=item['id']['videoId'],
                title=title,
                politicians=self.extract_politicians(title, politicians)
            )
            youtube_videos.append(youtube_video)

        return youtube_videos

    @staticmethod
    def extract_politicians(text: str, politicians: List[Politician]) -> List[int]:
        results = []
        for politician in politicians:
            if politician.name in text:
                results.append(politician.num)

        return results
