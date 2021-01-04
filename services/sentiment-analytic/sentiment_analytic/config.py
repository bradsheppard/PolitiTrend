import configparser
from dataclasses import dataclass

from pyspark import SparkContext

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
s3a_config = config_parser['s3a']
s3_config = config_parser['s3']
analytic_config = config_parser['analytic']
kafka_config = config_parser['kafka']


def load_spark_config(spark_context: SparkContext):
    # pylint: disable=protected-access
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.access.key', config.s3a_access_key)
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.secret.key', config.s3a_secret_key)
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.path.style.access', config.s3a_path_style_access)
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.impl', config.s3a_impl)
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.endpoint', config.s3a_endpoint)
    spark_context._jsc.hadoopConfiguration().set(
        'fs.s3a.connection.ssl.enabled', config.s3a_ssl_enabled)


@dataclass
class Config:
    # pylint: disable=too-many-instance-attributes
    s3_tweet_bucket: str
    s3_analyzed_tweets_bucket: str
    s3a_access_key: str
    s3a_secret_key: str
    s3a_path_style_access: str
    s3a_impl: str
    s3a_endpoint: str
    s3a_ssl_enabled: str
    analytic_lookback_days: int
    analytic_num_partitions: int
    kafka_bootstrap_server: str
    kafka_topic: str


config = Config(
    s3_config['tweet_bucket'],
    s3_config['analyzed_tweets_bucket'],
    s3a_config['fs.s3a.access.key'],
    s3a_config['fs.s3a.secret.key'],
    s3a_config['fs.s3a.path.style.access'],
    s3a_config['fs.s3a.impl'],
    s3a_config['fs.s3a.endpoint'],
    s3a_config['fs.s3a.connection.ssl.enabled'],
    int(analytic_config['lookback_days']),
    int(analytic_config['num_partitions']),
    kafka_config['bootstrap_server'],
    kafka_config['topic']
)
