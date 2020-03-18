import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

object SimpleApp {
  def main(args: Array[String]) {
    val spark = SparkSession.builder
      .master("local[*]")
      .appName("Tweet Word Count")
      .getOrCreate()

    val sc = spark.sparkContext
    sc.hadoopConfiguration.set("fs.s3a.access.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.secret.key", "brad1234")
    sc.hadoopConfiguration.set("fs.s3a.path.style.access", "true")
    sc.hadoopConfiguration.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    sc.hadoopConfiguration.set("fs.s3a.endpoint", "http://minio:9000")

    val dataframe = spark.read.json("s3a://tweets/topics/tweet-created/year=2020/month=03/day=17/hour=14")

    dataframe.withColumn("word", explode(split(dataframe.col("tweetText"), " ")))
        .groupBy("word")
        .count()
        .sort(desc("count"))
        .show()

    spark.stop()
  }
}
