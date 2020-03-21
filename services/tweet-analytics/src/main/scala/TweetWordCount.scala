import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._

object TweetWordCount {
  def main(args: Array[String]) {
    val spark = SparkSession.builder
      .master("local[*]")
      .appName("Tweet Word Count")
      .getOrCreate()

    import spark.implicits._

    val sc = spark.sparkContext

    sc.hadoopConfiguration.set("fs.s3a.access.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.secret.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.path.style.access", "true")
    sc.hadoopConfiguration.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    sc.hadoopConfiguration.set("fs.s3a.endpoint", "http://minio:9000")

    val dataframe = spark.read.json("s3a://tweets/topics/tweet-created/year=2020/month=03/day=21/hour=01")

    val w = Window.partitionBy($"politician").orderBy($"count".desc)

    val wordCountDataFrame = dataframe
        .withColumn("word", explode(split($"tweetText", "\\s+")))
        .withColumn("politician", explode($"sentiments.politician"))
        .filter(length($"word") >= 5)
        .groupBy("word", "politician")
        .count()
        .withColumn("row_number", row_number.over(w))
        .where($"row_number" <= 3)

    wordCountDataFrame.coalesce(1)
      .write
      .option("header","true")
      .option("sep",",")
      .mode("overwrite")
      .csv("results")

    wordCountDataFrame.show()

//    result.selectExpr("CAST(count AS STRING) as value")
//      .write
//      .format("kafka")
//      .option("kafka.bootstrap.servers", "queue-kafka-bootstrap:9092")
//      .option("topic", "news-article-created")
//      .save()

    spark.stop()
  }
}
