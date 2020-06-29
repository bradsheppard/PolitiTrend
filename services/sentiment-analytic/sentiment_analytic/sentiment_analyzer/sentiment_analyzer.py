from typing import Dict, List, Union

import spacy
from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.functions import udf, explode
from pyspark.sql.types import FloatType, IntegerType, MapType
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from sentiment_analytic.model.politician import Politician

sentiment_analyzer = SentimentIntensityAnalyzer()


def udf_sentiment(subjects):
    return udf(lambda statement: get_entity_sentiments(statement, subjects), json_schema)


nlp = spacy.load('en')


json_schema = MapType(IntegerType(), FloatType(), False)


def get_entity_sentiments(statement: str, subjects: List[Politician] = None) -> Dict[int, float]:
    doc = nlp(statement)

    results = {}
    for sent in doc.sents:
        score = sentiment_analyzer.polarity_scores(sent.text)['compound']
        pos_subjects = get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'], subjects)

        print("subjects" + str(pos_subjects))

        max_length = 0
        for subject in pos_subjects.values():
            if len(subject) > max_length:
                max_length = len(subject)

        for key in pos_subjects:
            if len(pos_subjects[key]) == max_length and max_length is not 0:
                results[key] = score

    return results


def get_pos_subjects(doc, pos_list, politicians) -> Dict[int, List[str]]:
    verbs = {politician.num: [] for politician in politicians}
    for possible_verb in doc:
        if possible_verb.pos_ in pos_list:
            found_child = False
            children = possible_verb.children
            for child in children:
                match = match_politician(child.text, politicians)
                if match is not None and child.dep_ == 'nsubj':
                    verbs[match.num].append(possible_verb)
                    traverse_subject_conjs(child, possible_verb, verbs, politicians)
                    found_child = True
            if not found_child:
                traverse_up(possible_verb, possible_verb, verbs, politicians)
    return verbs


def match_politician(text, politicians) -> Union[Politician, None]:
    for politician in politicians:
        split_name = politician.name.split()
        if text in split_name:
            return politician
    return None


def traverse_up(possible_verb, current, verbs, politicians):
    head = current.head
    if current == head:
        return
    children = head.children
    for child in children:
        match = match_politician(child.text, politicians)
        if match is not None and child.dep_ == 'nsubj':
            verbs[match.num].append(possible_verb)
            traverse_subject_conjs(child, possible_verb, verbs, politicians)
    traverse_up(possible_verb, head, verbs, politicians)


def traverse_subject_conjs(subj, possible_verb, verbs, politicians):
    children = subj.children
    for child in children:
        if child.dep_ == 'conj':
            match = match_politician(child.text, politicians)
            if match is not None:
                verbs[match.num].append(possible_verb)
                traverse_subject_conjs(child, possible_verb, verbs, politicians)


def analyze(dataframe, subjects: List[Politician]) -> DataFrame:
    sentiment_dataframe = dataframe \
        .withColumn('sentiments', udf_sentiment(subjects)('tweetText')) \
        .select(explode('sentiments').alias('politician', 'sentiment')) \
        .groupBy('politician') \
        .agg(F.avg('sentiment'), F.count('sentiment')) \
        .withColumnRenamed('avg(sentiment)', 'sentiment') \
        .withColumnRenamed('count(sentiment)', 'sampleSize')

    return sentiment_dataframe
