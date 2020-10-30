from typing import List

from pyspark.sql import SparkSession, DataFrame

from sentiment_analytic.config import config
from sentiment_analytic.path_translator import get_s3_path
from sentiment_analytic.config_reader import load_config
from sentiment_analytic.politician import Politician, get_all
from sentiment_analytic.sentiment_analyzer import analyze


def main():
    politicians: List[Politician] = get_all()

    spark = SparkSession.builder \
        .getOrCreate()

    load_config(spark.sparkContext)

    paths = [get_s3_path(i) for i in range(int(config.analytic_lookback_days))]

    dataframe = None

    for path in paths:
        try:
            current_dataframe = spark.read.json(path)
            if dataframe is None:
                dataframe = current_dataframe
            else:
                dataframe = dataframe.union(current_dataframe)
        # pylint: disable=broad-except
        except Exception as ex:
            print(ex)

    dataframe.persist()

    sentiment_dataframe: DataFrame = analyze(dataframe, politicians).persist()

    sentiment_dataframe.selectExpr('to_json(struct(*)) AS value') \
        .write \
        .format('kafka') \
        .option('kafka.bootstrap.servers', config.kafka_bootstrap_server) \
        .option('topic', config.kafka_topic) \
        .save()

    spark.stop()


main()
