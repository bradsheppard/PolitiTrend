from typing import List

from crawler.config import config
from crawler.model.politician import PoliticianRepository, Politician
from crawler.model.youtube_video import YoutubeVideoCrawler, YoutubeVideoRepository

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

youtube_video_crawler: YoutubeVideoCrawler = YoutubeVideoCrawler(config.api_key)
youtube_repository: YoutubeVideoRepository = YoutubeVideoRepository()

for politician in politicians:
    print("Crawling for " + politician.name)
    youtube_videos = youtube_video_crawler.get(politician, politicians)
    for youtube_video in youtube_videos:
        youtube_repository.insert(youtube_video)
