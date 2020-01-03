from crawler.config import config
from crawler.ml import SentimentAnalyzer
from crawler.model import PoliticianRepository, Opinion, OpinionRepository, OpinionSummaryJobRepository, \
    OpinionSummaryJob
from crawler.twitter import TweetCrawler

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)

politician_repository = PoliticianRepository()
opinion_repository = OpinionRepository()
sentiment_analyzer = SentimentAnalyzer()
opinion_summary_job_repository = OpinionSummaryJobRepository()

politicians = politician_repository.get_all()

for politician in politicians:
    print('Obtaining tweets for politician ' + politician.name)
    tweets = tweet_crawler.get(politician.name)
    for tweet in tweets:
        sentiment = sentiment_analyzer.analyze(tweet.full_text)

        opinion = Opinion()
        opinion.sentiment = sentiment
        opinion.politician = politician.num
        opinion.tweetId = tweet.id_str
        opinion.tweetText = tweet.full_text

        opinion_repository.insert(opinion)

    opinion_summary_job = OpinionSummaryJob()
    opinion_summary_job.politician = politician.num
    
    opinion_summary_job_repository.insert(opinion_summary_job)
