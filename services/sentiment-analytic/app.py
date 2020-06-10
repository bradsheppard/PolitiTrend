from typing import List

from pyspark.sql import SparkSession, DataFrame

from sentiment_analytic.common.path_translator import get_s3_path
from sentiment_analytic.config import load_config
from sentiment_analytic.model.politician import PoliticianRepository, Politician
from sentiment_analytic.sentiment_analyzer import analyze

politician_repository = PoliticianRepository()
politicians: List[Politician] = politician_repository.get_all()

spark = SparkSession.builder \
    .getOrCreate()

load_config(spark.sparkContext)

paths = [get_s3_path(0), get_s3_path(1), get_s3_path(2), get_s3_path(3)]

dataframe = None

for path in paths:
    try:
        current_dataframe = spark.read.json(path)
        if dataframe is None:
            dataframe = current_dataframe
        else:
            dataframe = dataframe.union(current_dataframe)
    except Exception as e:
        print(e)

dataframe.persist()

sentiment_dataframe: DataFrame = analyze(dataframe, politicians).persist()

sentiment_dataframe.selectExpr('to_json(struct(*)) AS value') \
    .write \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'queue-kafka-bootstrap:9092') \
    .option('topic', 'analytics-sentiment-created') \
    .save()

spark.stop()
