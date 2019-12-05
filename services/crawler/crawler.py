from crawler.config import config
from crawler.twitter import TweetCrawler
from crawler.model import PoliticianRepository, Opinion, OpinionRepository
from crawler.message_bus import MessageBus

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)

message_bus = MessageBus('queue-kafka', 'opinion')
politician_repository = PoliticianRepository()
opinion_repository = OpinionRepository()

politicians = politician_repository.get_all()

for politician in politicians:
    print('Obtaining tweets for politician ' + politician.name)
    tweets = tweet_crawler.get(politician.name)
    for tweet in tweets:
        opinion = Opinion()
        opinion.sentiment = 1
        opinion.politician = politician.num
        opinion.tweetId = tweet.id_str
        opinion.tweetText = tweet.full_text

        opinion_repository.insert(opinion)
