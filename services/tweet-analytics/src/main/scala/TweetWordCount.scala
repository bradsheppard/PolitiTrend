import java.util.Calendar

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._

object TweetWordCount {

  case class CreateWord(word: String, count: Int)
  case class CreateWordCloud(politician: Int, words: Seq[CreateWord])

  def main(args: Array[String]) {
    val spark = SparkSession.builder
      .master("local[*]")
      .appName("Tweet Word Count")
      .getOrCreate()

    import spark.implicits._

    val sc = spark.sparkContext

    val now = Calendar.getInstance()
    val currentYear = now.get(Calendar.YEAR)
    val currentMonth = "%02d".format(now.get(Calendar.MONTH) + 1)
    val currentDay = now.get(Calendar.DAY_OF_MONTH)

    sc.hadoopConfiguration.set("fs.s3a.access.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.secret.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.path.style.access", "true")
    sc.hadoopConfiguration.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    sc.hadoopConfiguration.set("fs.s3a.endpoint", "http://minio:9000")

    val dataframe = spark.read.json(s"s3a://tweets/topics/tweet-created/" +
      s"year=${currentYear}/month=${currentMonth}/day=${currentDay}")

    val w = Window.partitionBy($"politician").orderBy($"count".desc)

    val wordCountDataFrame = dataframe
        .withColumn("word", explode(split($"tweetText", "\\s+")))
        .withColumn("politician", explode($"sentiments.politician"))
        .filter(length($"word") >= 5)
        .groupBy("word", "politician")
        .count()
        .withColumn("row_number", row_number.over(w))
        .where($"row_number" <= 10).persist()

    val makeWord = udf((word: String, count: Int) => CreateWord(word, count))
    val makeWordCloud = udf((politician: Int, words: Seq[CreateWord]) => CreateWordCloud(politician, words))

    val politicianWordCountDataFrame = wordCountDataFrame.groupBy("politician")
      .agg(
        collect_list(
          makeWord(col("word"), col("count"))
        ).as("words")
      )
    val createWordCloudDataframe = politicianWordCountDataFrame.select(makeWordCloud(col("politician"), col("words")).as("value"))
    createWordCloudDataframe.show()

    val jsonifiedDataframe = createWordCloudDataframe.select(to_json(col("value")).as("value"))
    jsonifiedDataframe.show()

    jsonifiedDataframe.coalesce(1)
      .write
      .option("header","true")
      .option("sep",",")
      .mode("overwrite")
      .csv("results")

    jsonifiedDataframe.select($"value")
      .write
      .format("kafka")
      .option("kafka.bootstrap.servers", "queue-kafka-bootstrap:9092")
      .option("topic", "word-cloud-created")
      .save()

    spark.stop()
  }
}
