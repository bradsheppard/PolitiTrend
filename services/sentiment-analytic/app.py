from pyspark.sql import SparkSession, DataFrame

from sentiment_analyzer.common.path_translator import get_s3_path
from sentiment_analyzer.config.config_reader import load_config
from sentiment_analyzer import analyze

spark = SparkSession.builder \
    .getOrCreate()

load_config(spark.sparkContext)

s3_path_1 = get_s3_path(0)
s3_path_2 = get_s3_path(1)

dataframe: DataFrame = spark.read.json([s3_path_1, s3_path_2]).persist()

sentiment_dataframe: DataFrame = analyze(dataframe)
sentiment_dataframe.show()

sentiment_dataframe.selectExpr('to_json(struct(*)) AS value') \
    .write \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'queue-kafka-bootstrap:9092') \
    .option('topic', 'analytics-sentiment-created') \
    .save()

spark.stop()
