import configparser
from sentiment_analyzer.twitter import TweetCrawler
from sentiment_analyzer.model import PoliticianRepository, Opinion, OpinionRepository
from sentiment_analyzer.message_bus import MessageBus

config = configparser.ConfigParser()
config.read('config.ini')
twitter_config = config['twitter']
tweet_crawler = TweetCrawler(twitter_config['consumer_key'], twitter_config['consumer_secret'],
                             twitter_config['access_token'], twitter_config['access_token_secret'])

message_bus = MessageBus('queue-kafka', 'opinion')
politician_repository = PoliticianRepository()
opinion_repository = OpinionRepository()

politicians = politician_repository.get_all()

for politician in politicians:
    tweets = tweet_crawler.get(politician.name)
    for tweet in tweets:
        opinion = Opinion()
        opinion.sentiment = 1
        opinion.politician = politician.num
        opinion.tweetId = tweet.text
        opinion.tweetText = tweet

        opinion_repository.insert(opinion)
