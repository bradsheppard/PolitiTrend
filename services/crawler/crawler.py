from typing import List, Union
from crawler.config import config
from crawler.ml import SentimentAnalyzer
from crawler.model import PoliticianRepository, TweetRepository, OpinionSummaryJobRepository, \
    OpinionSummaryJob
from crawler.model import TweetCrawler
from crawler.model.politician import Politician
from crawler.orchestrator import CrawlerConfiguration, Orchestrator

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)
tweet_repository = TweetRepository()

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()
opinion_summary_job_repository = OpinionSummaryJobRepository()
sentiment_analyzer = SentimentAnalyzer(list(map(lambda pol: pol.name, politicians)))

tweet_crawler_config = CrawlerConfiguration(crawler=tweet_crawler, repository=tweet_repository,
                                            property_of_interest='tweetText')

orchestrator = Orchestrator([tweet_crawler_config], sentiment_analyzer)

for politician in politicians:
    orchestrator.crawl_all(politician.name)


def politician_to_id(politician_name: str) -> Union[int, None]:
    return next((x.num for x in politicians if x.name == politician_name), None)


opinion_summary_job = OpinionSummaryJob()
opinion_summary_job.politician = politician.num

opinion_summary_job_repository.insert(opinion_summary_job)
