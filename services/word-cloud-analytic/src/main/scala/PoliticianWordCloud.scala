import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, SparkSession}

object PoliticianWordCloud {

    case class Tweet(tweetText: String, tweetId: String, sentiments: Seq[Sentiment])

    case class Sentiment(politician: Long, value: Double)

    case class WordCount(politician: Long, word: String, count: Long)

    case class CreateWord(word: String, count: Long)

    case class CreateWordCloud(politician: Long, words: Seq[CreateWord])

    def main(args: Array[String]) {
        val spark = SparkSession.builder
            .appName("Politician Word Cloud")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext
        ConfigReader.load(sc)

        val todaysS3Path = PathTranslator.getS3Path()
        val yesterdaysS3Path = PathTranslator.getS3Path(1)

        val dataframe: Dataset[Tweet] = spark.read.json(todaysS3Path, yesterdaysS3Path).as[Tweet].persist()

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
            .option("topic", "word-cloud-politician-word-cloud-created")
            .save()

        spark.stop()
    }
}
