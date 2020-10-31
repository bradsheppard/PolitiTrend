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
    StructField('politicians', ArrayType(LongType())),
    StructField('politicianSentiments', ArrayType(LongType())),
    StructField('sentiments', ArrayType(FloatType()))
])


def udf_generator(subjects: List[Politician]):
    def pandas_udf_sentiment(pdf):
        tweets = pdf['tweetText'].tolist()

        computed_sentiments = get_entity_sentiments(tweets, subjects)
        politician_sentiments = []
        sentiments = []

        for computed_sentiment in computed_sentiments:
            tweet_politician_sentiments = []
            tweet_sentiments = []
            for num in computed_sentiment.keys():
                tweet_politician_sentiments.append(num)
            for val in computed_sentiment.values():
                tweet_sentiments.append(val)

            sentiments.append(tweet_sentiments)
            politician_sentiments.append(tweet_politician_sentiments)

        pdf['politicianSentiments'] = politician_sentiments
        pdf['sentiments'] = sentiments

        return pdf[['tweetText', 'politicians', 'politicianSentiments', 'sentiments']]

    return pandas_udf_sentiment


nlp = spacy.load('en')


def get_entity_sentiments(statements: List[str],
                          subjects: List[Politician] = None) -> List[Dict[int, float]]:
    # pylint: disable=too-many-locals
    # pylint: disable=too-many-branches
    result_list = []
    for doc in nlp.pipe(statements):
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
                politicians = _match_politicians(entity, subjects)
                for politician in politicians:
                    if politician.num not in results:
                        results[politician.num] = [score]
                    else:
                        results[politician.num].append(score)

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


def compute_sentiments(iterator, politicians: List[Politician]):
    return [get_entity_sentiments(x, politicians) for x in iterator]


def analyze(dataframe: DataFrame, subjects: List[Politician]) -> DataFrame:
    dataframe = dataframe.groupBy('politicians').applyInPandas(udf_generator(subjects), json_schema)

    sentiment_dataframe = dataframe \
        .withColumn('vars', explode(arrays_zip('politicianSentiments', 'sentiments'))) \
        .selectExpr('tweetText', 'vars.politicianSentiments as politician',
                    'vars.sentiments as sentiment') \
        .groupBy('politician') \
        .agg(F.avg('sentiment'), F.count('sentiment')) \
        .withColumnRenamed('avg(sentiment)', 'sentiment') \
        .withColumnRenamed('count(sentiment)', 'sampleSize')

    return sentiment_dataframe
