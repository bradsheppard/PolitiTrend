import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from pyspark.sql.functions import udf, explode
from pyspark.sql.types import StringType

nltk.download('vader_lexicon')

sentiment_analyzer = SentimentIntensityAnalyzer()
udf_calculate_sentiment = udf(lambda x: sentiment_analyzer.polarity_scores(x)['compound'], StringType())


def analyze(dataframe):
    sentiment_dataframe = dataframe \
        .withColumn('sentiment', udf_calculate_sentiment('tweetText')) \
        .withColumn('politician', explode(dataframe['politicians'])) \
        .groupBy('politician') \
        .agg({'sentiment': 'avg'}).withColumnRenamed('avg(sentiment)', 'sentiment')

    return sentiment_dataframe
