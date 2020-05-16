package com.voyce.globalwordcloud

import com.voyce.common.{ConfigReader, PathTranslator, Tweet}
import org.apache.spark.sql.{Dataset, SparkSession}

object GlobalWordCloudAnalytic {

    def main(args: Array[String]) {
        val spark = SparkSession.builder
            .appName("Global Word Cloud")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext
        ConfigReader.load(sc)

        val paths = List(PathTranslator.getS3Path(), PathTranslator.getS3Path(1))

        var dataframe: Option[Dataset[Tweet]] = None

        for(path <- paths) {
            try {
                val currentDataframe: Dataset[Tweet] = spark.read.json(path).as[Tweet].persist()
                if(dataframe.isEmpty) {
                    dataframe = Option.apply(currentDataframe)
                }
                else {
                    dataframe.get.union(currentDataframe)
                }
            }
            catch {
                case e: Exception =>
                    println(e)
            }
        }

        val politicianWordCountDataFrame = GlobalWordCloudCalculator.calculate(spark, dataframe.get)

        val jsonifiedDataframe = politicianWordCountDataFrame.toJSON

        jsonifiedDataframe.select($"value")
            .write
            .format("kafka")
            .option("kafka.bootstrap.servers", "queue-kafka-bootstrap:9092")
            .option("topic", "analytics-global-word-cloud-created")
            .save()

        spark.stop()
    }
}
