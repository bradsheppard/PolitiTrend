from pyspark.sql import SparkSession, DataFrame

from sentiment_analyzer.common.path_translator import get_s3_path
from sentiment_analyzer.config.config_reader import load_config
from sentiment_analyzer import analyze

spark = SparkSession.builder \
    .getOrCreate()

load_config(spark.sparkContext)

paths = [get_s3_path(0), get_s3_path(1)]

dataframe = None

for path in paths:
    try:
        current_dataframe = spark.read.json(path).persist()
        if dataframe is None:
            dataframe = current_dataframe
        else:
            dataframe = dataframe.union(current_dataframe)
    except Exception as e:
        print(e)

sentiment_dataframe: DataFrame = analyze(dataframe)
sentiment_dataframe.show()

sentiment_dataframe.selectExpr('to_json(struct(*)) AS value') \
    .write \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'queue-kafka-bootstrap:9092') \
    .option('topic', 'analytics-sentiment-created') \
    .save()

spark.stop()
