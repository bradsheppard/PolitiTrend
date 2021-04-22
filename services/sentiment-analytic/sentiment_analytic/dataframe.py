from typing import List

import pandas as pd
from functional import seq
from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.functions import explode, arrays_zip
from pyspark.sql.types import FloatType, ArrayType, StructType, StructField, StringType, LongType

from sentiment_analytic.politician import Politician
from sentiment_analytic.sentiment_analyzer import SentimentAnalyzer

json_schema = StructType([
    StructField('tweetText', StringType()),
    StructField('tweetId', StringType()),
    StructField('politicians', ArrayType(LongType())),
    StructField('politicianSentiments', ArrayType(LongType())),
    StructField('parties', ArrayType(StringType())),
    StructField('sentiments', ArrayType(FloatType())),
    StructField('dateTime', StringType())
])


def udf_generator(politicians: List[Politician]):
    def pandas_udf_sentiment(pdf: pd.DataFrame):
        sentiment_analyzer = SentimentAnalyzer()

        tweets = pdf['tweetText'].tolist()
        entities = pdf['politicians']\
            .apply(lambda x: [element for element in politicians if element.id in x])

        computed_sentiments = sentiment_analyzer.get_entity_sentiments(tweets, entities)
        politician_sentiments = []
        sentiments = []
        parties = []

        for computed_sentiment in computed_sentiments:
            tweet_politician_sentiments = []
            tweet_sentiments = []
            tweet_parties = []

            for politician_id in computed_sentiment.keys():
                politician = seq(politicians)\
                    .find(lambda x, search_id=politician_id:  x.id == search_id)
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

        return pdf[['tweetText', 'tweetId', 'politicians',
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


def analyze(dataframe: DataFrame, subjects: List[Politician]) -> DataFrame:
    dataframe = dataframe.groupBy('politicians') \
        .applyInPandas(udf_generator(subjects), json_schema)

    return dataframe
