from pyspark.sql import SparkSession

from common.path_translator import get_s3_path
from config.config_reader import load_config
from sentiment_analyzer import analyze

spark = SparkSession.builder \
    .master('local[*]') \
    .getOrCreate()

load_config(spark.sparkContext)

s3_path = get_s3_path(1)

dataframe = spark.read.json(s3_path).persist()

sentiment_dataframe = analyze(dataframe)

sentiment_dataframe.show()
