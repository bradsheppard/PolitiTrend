from typing import List, Iterator, Callable

import pandas as pd
from functional import seq
from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.functions import explode, arrays_zip, col, when, avg, countDistinct
from pyspark.sql.types import FloatType, ArrayType, StructType, StructField, StringType, LongType

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import SentimentAnalyzer
from sentiment_analytic.state_lookup import get_state

json_schema = StructType([
    StructField('tweetText', StringType()),
    StructField('tweetId', StringType()),
    StructField('politicians', ArrayType(LongType())),
    StructField('politicianSentiments', ArrayType(LongType())),
    StructField('parties', ArrayType(StringType())),
    StructField('sentiments', ArrayType(FloatType())),
    StructField('dateTime', StringType()),
    StructField('state', StringType())
])


def sentiment_udf_generator(politicians: List[Politician]) -> \
        Callable[[Iterator[pd.DataFrame]], Iterator[pd.DataFrame]]:
    def pandas_udf_sentiment(iterator: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
        SentimentAnalyzer.load()

        for pdf in iterator:

            pdf['state'] = pdf['location'].apply(get_state)
            tweets = pdf['tweetText'].tolist()
            entities = pdf['politicians'] \
                .apply(lambda x: [element for element in politicians if element.id in x])

            computed_sentiments = SentimentAnalyzer.get_entity_sentiments(tweets, entities)
            politician_sentiments = []
            sentiments = []
            parties = []

            for computed_sentiment in computed_sentiments:
                tweet_politician_sentiments = []
                tweet_sentiments = []
                tweet_parties = []

                for politician_id in computed_sentiment.keys():
                    politician = seq(politicians) \
                        .find(lambda x, search_id=politician_id: x.id == search_id)
                    tweet_politician_sentiments.append(politician_id)
                    tweet_parties.append(politician.party)
                for sentiment in computed_sentiment.values():
                    tweet_sentiments.append(sentiment)

                sentiments.append(tweet_sentiments)
                politician_sentiments.append(tweet_politician_sentiments)
                parties.append(tweet_parties)

            pdf['politicianSentiments'] = politician_sentiments
            pdf['sentiments'] = sentiments
            pdf['parties'] = parties

            yield pdf[['tweetText', 'tweetId', 'politicians', 'state',
                       'politicianSentiments', 'sentiments', 'parties', 'dateTime']]

    return pandas_udf_sentiment


def to_politician_sentiment_dataframe(dataframe: DataFrame) -> DataFrame:
    sentiment_dataframe = dataframe \
        .withColumn('vars', explode(arrays_zip('politicianSentiments', 'sentiments'))) \
        .selectExpr('tweetText', 'vars.politicianSentiments as politician',
                    'vars.sentiments as sentiment') \
        .groupBy('politician') \
        .agg(F.avg('sentiment'), F.count('sentiment')) \
        .withColumnRenamed('avg(sentiment)', 'sentiment') \
        .withColumnRenamed('count(sentiment)', 'sampleSize')

    return sentiment_dataframe


def to_party_sentiment_dataframe(dataframe: DataFrame) -> DataFrame:
    sentiment_dataframe = dataframe \
        .withColumn('vars', explode(arrays_zip('parties', 'sentiments'))) \
        .selectExpr('tweetText', 'vars.parties as party',
                    'vars.sentiments as sentiment') \
        .groupBy('party') \
        .agg(F.avg('sentiment'), F.count('sentiment')) \
        .withColumnRenamed('avg(sentiment)', 'sentiment') \
        .withColumnRenamed('count(sentiment)', 'sampleSize')

    return sentiment_dataframe


def to_state_sentiment_dataframe(dataframe: DataFrame) -> DataFrame:
    sentiment_dataframe = dataframe \
        .withColumn('vars', explode(arrays_zip('parties', 'sentiments'))) \
        .selectExpr('tweetText', 'state', 'tweetId',
                    'vars.sentiments as sentiment',
                    'vars.parties as party') \
        .filter(col('state').isNotNull()) \
        .groupBy('state') \
        .agg(
            avg(when(col('party') == 'Republican', col('sentiment'))).alias('RepublicanSentiment'),
            avg(when(col('party') == 'Democratic', col('sentiment'))).alias('DemocraticSentiment'),
            countDistinct('tweetId').alias('sampleSize')) \
        .withColumn('affiliations',
                    F.struct(
                        F.coalesce(col('DemocraticSentiment'), F.lit(0)).alias('democratic'),
                        F.coalesce(col('RepublicanSentiment'), F.lit(0)).alias('republican'))) \
        .drop('RepublicanSentiment', 'DemocraticSentiment')

    return sentiment_dataframe


def analyze(dataframe: DataFrame, subjects: List[Politician]) -> DataFrame:
    dataframe = dataframe.mapInPandas(sentiment_udf_generator(subjects), json_schema)

    return dataframe
