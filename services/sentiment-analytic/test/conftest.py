# pylint: disable=redefined-outer-name

import pytest
from pyspark.sql import SparkSession

from sentiment_analytic.config import load_spark_config


@pytest.fixture(scope='session')
def spark_session():
    spark_session = SparkSession.builder \
        .getOrCreate()

    load_spark_config(spark_session.sparkContext)

    return spark_session
