from typing import List

from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col

from sentiment_analytic.config import config, load_spark_config
from sentiment_analytic.politician import Politician, get_all
from sentiment_analytic.tweet_repository import TweetRepository
from sentiment_analytic.sentiment_analyzer import analyze, to_results_dataframe


def main():
    politicians: List[Politician] = get_all()

    spark = SparkSession.builder \
        .getOrCreate()

    load_spark_config(spark.sparkContext)

    tweet_repository = TweetRepository(spark)

    tweets = tweet_repository\
        .read_tweets()\
        .drop_duplicates(['tweetId'])\
        .persist()
    analyzed_tweets = tweet_repository\
        .read_analyzed_tweets('analyzed-tweets')\
        .drop_duplicates(['tweetId'])\
        .persist()

    tweets_to_analyze = tweets.join(analyzed_tweets, 'tweetId', 'left_anti')
    tweets_already_analyzed = analyzed_tweets.alias('analyzed')\
        .join(tweets.alias('tweets'), 'tweetId', 'inner')\
        .select([col('analyzed.'+xx) for xx in analyzed_tweets.columns])

    tweet_sentiments: DataFrame = analyze(tweets_to_analyze, politicians).persist()

    tweet_sentiments = tweet_sentiments\
        .unionByName(tweets_already_analyzed)\
        .repartition(config.analytic_num_partitions)
    result_dataframe: DataFrame = to_results_dataframe(tweet_sentiments)

    TweetRepository.write_analyzed_tweets(tweet_sentiments, 'temp')

    result_dataframe.selectExpr('to_json(struct(*)) AS value') \
        .write \
        .format('kafka') \
        .option('kafka.bootstrap.servers', config.kafka_bootstrap_server) \
        .option('topic', config.kafka_topic) \
        .save()

    spark.stop()


def transfer_results_to_bucket():
    spark = SparkSession.builder \
        .getOrCreate()

    load_spark_config(spark.sparkContext)
    tweet_repository = TweetRepository(spark)

    tweets = tweet_repository\
        .read_analyzed_tweets('temp')\
        .repartition(config.analytic_num_partitions)
    TweetRepository.write_analyzed_tweets(tweets, 'analyzed-tweets')

    spark.stop()


main()
transfer_results_to_bucket()
