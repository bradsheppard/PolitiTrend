import pytest
import pandas as pd

from pyspark.sql import SparkSession
from sentiment_analyzer import analyze


@pytest.fixture(scope='session')
def spark_context():
    spark_context = SparkSession.builder \
        .master('local[*]') \
        .getOrCreate()

    return spark_context


def test_analyze(spark_context):
    test_data = [
        {
            'tweetText': 'Im awesome',
            'politicians': [1]
        },
        {
            'tweetText': 'I suck',
            'politicians': [2]
        }
    ]

    expected_data = [
        {
            'sentiment': 0.6249,
            'politician': 1
        },
        {
            'sentiment': -0.4404,
            'politician': 2
        }
    ]

    dataframe = spark_context.createDataFrame(test_data)

    ouput_dataframe = analyze(dataframe).toPandas()
    expected_dataframe = spark_context.createDataFrame(expected_data).toPandas()

    pd.testing.assert_frame_equal(expected_dataframe, ouput_dataframe, check_like=True)
