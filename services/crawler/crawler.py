from typing import List

from crawler.config import config
from crawler.ml import SentimentAnalyzer, AnalysisResult
from crawler.model import PoliticianRepository, Tweet, TweetRepository, OpinionSummaryJobRepository, \
    OpinionSummaryJob, Sentiment
from crawler.model.politician import Politician
from crawler.twitter import TweetCrawler

tweet_crawler = TweetCrawler(config.twitter_consumer_key, config.twitter_consumer_secret,
                             config.twitter_access_token, config.twitter_access_token_secret)

politician_repository = PoliticianRepository()
tweet_repository = TweetRepository()
opinion_summary_job_repository = OpinionSummaryJobRepository()


def get_politician_name(pol: Politician):
    return pol.name


politicians: List[Politician] = politician_repository.get_all()

sentiment_analyzer = SentimentAnalyzer(list(map(get_politician_name, politicians)))
for politician in politicians:
    print('Obtaining tweets for politician ' + politician.name)
    tweets = tweet_crawler.get(politician.name)
    for tweet in tweets:
        analysis_result: AnalysisResult = sentiment_analyzer.analyze(tweet.full_text)

        tweet_to_insert = Tweet()
        tweet_to_insert.sentiments = []

        for subject_result in analysis_result.subjectResults.keys():
            sentiment = Sentiment()
            sentiment.politician = subject_result
            sentiment.value = analysis_result.subjectResults[subject_result]
            tweet_to_insert.sentiments.append(sentiment)

        tweet_to_insert.tweetId = tweet.id_str
        tweet_to_insert.tweetText = tweet.full_text

        tweet_repository.insert(tweet_to_insert)

    opinion_summary_job = OpinionSummaryJob()
    opinion_summary_job.politician = politician.num
    
    opinion_summary_job_repository.insert(opinion_summary_job)
