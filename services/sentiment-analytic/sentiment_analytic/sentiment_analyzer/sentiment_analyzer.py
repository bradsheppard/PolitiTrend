from typing import Dict, List, Union

import spacy
from attr import dataclass
from pyspark.sql import DataFrame
from pyspark.sql.functions import udf, explode
from pyspark.sql.types import FloatType, IntegerType, MapType
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from sentiment_analytic.model.politician import Politician

sentiment_analyzer = SentimentIntensityAnalyzer()


def udf_sentiment(subjects):
    return udf(lambda statement: get_entity_sentiments(statement, subjects), json_schema)


nlp = spacy.load('en')


@dataclass
class SentenceSubjectResult:
    sentiment: float
    subject: Politician
    pos: str


@dataclass
class AnalysisResult:
    politcian: int
    sentiment: float


json_schema = MapType(IntegerType(), FloatType(), False)


def get_entity_sentiments(statement: str, subjects: List[Politician] = None) -> Dict[int, float]:
    subject_results = {}

    sentences_subject_results: Dict[int, Dict[Politician, SentenceSubjectResult]] = {}
    doc = nlp(statement)
    for token in doc:
        politician = _lookup_subject(subjects, token.text)
        if politician is None:
            continue
        score = sentiment_analyzer.polarity_scores(token.sent.text)['compound']

        subject_result = SentenceSubjectResult(sentiment=score, subject=politician, pos=token.dep_)
        if token.sent.start not in sentences_subject_results:
            sentences_subject_results[token.sent.start] = {}
        sentences_subject_results[token.sent.start][politician] = subject_result

    for sentence_subject_results in sentences_subject_results.values():
        if len(sentence_subject_results.keys()) == 0:
            continue
        elif len(sentence_subject_results.keys()) == 1:
            key = list(sentence_subject_results.keys())[0]
            subject_results[sentence_subject_results[key].subject.num] = \
                sentence_subject_results[key].sentiment
            continue
        for politician in sentence_subject_results.keys():
            subject_result = sentence_subject_results[politician]
            if subject_result.pos == 'nsubj' or subject_result.pos == 'compound':
                continue
            subject_results[subject_result.subject.num] = subject_result.sentiment

    return subject_results


def _lookup_subject(subjects: List[Politician], sentence_subject: str) -> Union[Politician, None]:
    if subjects is None:
        return None

    for subject in subjects:
        subject_words = subject.name.split()
        for subject_word in subject_words:
            if sentence_subject.lower() == subject_word.lower():
                return subject
    return None


def analyze(dataframe, subjects: List[Politician]) -> DataFrame:
    sentiment_dataframe = dataframe \
        .withColumn('sentiments', udf_sentiment(subjects)('tweetText')) \
        .select(explode('sentiments').alias('politician', 'sentiment')) \
        .groupBy('politician') \
        .agg({'sentiment': 'avg'}).withColumnRenamed('avg(sentiment)', 'sentiment')

    return sentiment_dataframe
