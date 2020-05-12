from pyspark import SparkContext

from sentiment_analyzer.config import config


def load_config(spark_context: SparkContext):
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.access.key', config.s3a_access_key)
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.secret.key', config.s3a_secret_key)
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.path.style.access', config.s3a_path_style_access)
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.impl', config.s3a_impl)
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.endpoint', config.s3a_endpoint)
    spark_context._jsc.hadoopConfiguration().set('fs.s3a.connection.ssl.enabled', config.s3a_ssl_enabled)
