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
            .appName("Global Word Cloud")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext
        ConfigReader.load(sc)

        val todaysS3Path = PathTranslator.getS3Path()
        val yesterdaysS3Path = PathTranslator.getS3Path(1)

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
}
