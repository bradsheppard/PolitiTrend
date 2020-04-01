import java.util.Calendar

import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, SparkSession}

object GlobalWordCloud {
    case class Tweet(tweetText: String, tweetId: String, sentiments: Seq[Sentiment])

    case class Sentiment(politician: Long, value: Double)

    case class WordCount(word: String, count: Long)

    case class CreateWord(word: String, count: Long)

    case class CreateWordCloud(words: Seq[CreateWord])

    def main(args: Array[String]) {
        val spark = SparkSession.builder
            .master("local[*]")
            .appName("Tweet Word Count")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext
        ConfigReader.load(sc)

        val todaysS3Path = getS3Path()
        val yesterdaysS3Path = getS3Path(1)

        val dataframe: Dataset[Tweet] = spark.read.json(todaysS3Path, yesterdaysS3Path).as[Tweet].persist()

        val makeWord = udf((word: String, count: Long) => CreateWord(word, count))

        var wordCountDataFrame: Dataset[WordCount] = dataframe
            .withColumn("word",
                explode(
                    split($"tweetText", "\\s+")
                )
            )

            .groupBy("word")
            .count().as[WordCount]

        wordCountDataFrame = wordCountDataFrame
            .filter(x => x.word.length() >= 5).orderBy($"count".desc)
            .limit(20).as[WordCount]

        val politicianWordCountDataFrame: Dataset[CreateWordCloud] = wordCountDataFrame
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
            .option("topic", "word-cloud-global-word-cloud-created")
            .save()

        spark.stop()
    }

    def getS3Path(offset: Int = 0): String = {
        val now = Calendar.getInstance()
        now.add(Calendar.DAY_OF_YEAR, -offset)
        val currentYear = now.get(Calendar.YEAR)
        val currentMonth = "%02d".format(now.get(Calendar.MONTH) + 1)
        val currentDay = now.get(Calendar.DAY_OF_MONTH)

        val s3Path = "s3a://tweets/topics/tweet-created/" +
            s"year=$currentYear/month=$currentMonth/day=$currentDay/hour=01"

        s3Path
    }
}
