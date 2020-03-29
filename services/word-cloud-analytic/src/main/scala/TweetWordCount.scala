import java.util.Calendar

import org.apache.spark.sql.{Dataset, SparkSession}
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._

object TweetWordCount {

    case class Tweet(tweetText: String, tweetId: String, sentiments: Seq[Sentiment])

    case class Sentiment(politician: Long, value: Double)

    case class WordCount(politician: Long, word: String, count: Long)

    case class CreateWord(word: String, count: Long)

    case class CreateWordCloud(politician: Long, words: Seq[CreateWord])

    def main(args: Array[String]) {
        val spark = SparkSession.builder
            .appName("Tweet Word Count")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext

        val now = Calendar.getInstance()
        val currentYear = now.get(Calendar.YEAR)
        val currentMonth = "%02d".format(now.get(Calendar.MONTH) + 1)
        val currentDay = now.get(Calendar.DAY_OF_MONTH)

        val s3Path = "s3a://tweets/topics/tweet-created/" +
            s"year=${currentYear}/month=${currentMonth}/day=${currentDay}/hour=01"

        sc.hadoopConfiguration.set("fs.s3a.access.key", "brad1234")
        sc.hadoopConfiguration.set("fs.s3a.secret.key", "brad1234")
        sc.hadoopConfiguration.set("fs.s3a.path.style.access", "true")
        sc.hadoopConfiguration.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
        sc.hadoopConfiguration.set("fs.s3a.endpoint", "http://minio:9000")
        sc.hadoopConfiguration.set("fs.s3a.connection.ssl.enabled", "false")

        val dataframe: Dataset[Tweet] = spark.read.json(s3Path).as[Tweet].persist()

        val makeWord = udf((word: String, count: Long) => CreateWord(word, count))

        val w = Window.partitionBy($"politician").orderBy($"count".desc)

        var wordCountDataFrame: Dataset[WordCount] = dataframe
            .withColumn("word",
                explode(
                    split($"tweetText", "\\s+")
                )
            )
            .withColumn("politician", explode($"sentiments.politician"))

            .groupBy("word", "politician")
            .count().as[WordCount]

        wordCountDataFrame = wordCountDataFrame
            .filter(x => x.word.length() >= 5)
            .withColumn("row_number", row_number.over(w))
            .where($"row_number" <= 10).as[WordCount]

        val politicianWordCountDataFrame: Dataset[CreateWordCloud] = wordCountDataFrame.groupBy($"politician")
            .agg(
                collect_list(
                    makeWord(col("word"), col("count"))
                ).as("words").as[Set[CreateWord]]
            ).as[CreateWordCloud]

        val jsonifiedDataframe = politicianWordCountDataFrame.toJSON
        jsonifiedDataframe.show()

        jsonifiedDataframe.select($"value")
            .write
            .format("kafka")
            .option("kafka.bootstrap.servers", "queue-kafka-bootstrap:9092")
            .option("topic", "word-cloud-created")
            .save()

        spark.stop()
    }
}
