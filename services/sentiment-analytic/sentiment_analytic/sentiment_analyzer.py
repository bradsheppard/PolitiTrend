import math
from statistics import mean
from typing import Dict, List

import networkx as nx
import spacy
from functional import seq
from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.functions import explode, arrays_zip
from pyspark.sql.types import FloatType, ArrayType, StructType, StructField, StringType, LongType
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from sentiment_analytic.politician import Politician

sentiment_analyzer = SentimentIntensityAnalyzer()
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
    def pandas_udf_sentiment(pdf):
        tweets: List[str] = []
        entities: List[List[Politician]] = []

        for index, row in pdf.iterrows():
            tweet = row['tweetText']
            subjects = row['politicians']

            current_subjects: List[Politician] = []

            for subject in subjects:
                candidate_politician = seq(politicians).find(lambda x: x.id == subject)
                current_subjects.append(candidate_politician)

            tweets.append(tweet)
            entities.append(current_subjects)

        computed_sentiments = get_entity_sentiments(tweets, entities)
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


nlp = spacy.load('en')


def get_entity_sentiments(statements: List[str],
                          subjects: List[List[Politician]] = None) -> List[Dict[int, float]]:
    # pylint: disable=too-many-locals
    # pylint: disable=too-many-branches
    result_list = []
    for i, doc in enumerate(nlp.pipe(statements)):
        current_subjects = subjects[i]
        results = {}
        for sent in doc.sents:
            score = sentiment_analyzer.polarity_scores(sent.text)['compound']
            pos_words = _get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'])
            entities = seq(sent.ents) \
                .filter(lambda x: x.label_ == 'PERSON') \
                .map(lambda x: x.text) \
                .list()

            if len(entities) == 0:
                continue

            graph = nx.Graph()

            for token in sent:
                for child in token.children:
                    dep = child.dep_
                    weight = 0 if dep == 'conj' else 1
                    graph.add_edge('{0}'.format(token), '{0}'.format(child), weight=weight)

            path_lengths = {entity: 0 for entity in entities}

            for word in pos_words:
                for entity in entities:
                    names = entity.split()
                    try:
                        shortest_path = min(
                            [nx.dijkstra_path_length(
                                graph, source=word, target=name) for name in names])
                    except nx.NetworkXNoPath:
                        shortest_path = math.inf
                    path_lengths[entity] += shortest_path

            shortest_length = min(path_lengths.values())

            relevant_entities = seq(path_lengths.items()) \
                .filter(lambda x, length=shortest_length: x[1] == length) \
                .map(lambda x: x[0])

            for entity in relevant_entities:
                politicians = _match_politicians(entity, current_subjects)
                for politician in politicians:
                    if politician.id not in results:
                        results[politician.id] = [score]
                    else:
                        results[politician.id].append(score)

        for key in results:
            results[key] = mean(results[key])
        result_list.append(results)

    return result_list


def _get_pos_subjects(doc, pos_list) -> List[str]:
    results = []
    for word in doc:
        if word.pos_ in pos_list:
            results.append(word.text)

    return results


def _match_politicians(text, politicians) -> List[Politician]:
    results = []

    for politician in politicians:
        split_name = politician.name.split()
        for name in split_name:
            if name in text:
                results.append(politician)
    return results


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
