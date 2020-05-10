package com.voyce.politicianwordcloud

import com.voyce.common.{ConfigReader, PathTranslator, Tweet}
import org.apache.spark.sql.{Dataset, SparkSession}

object PoliticianWordCloudAnalytic {

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

        val politicianWordCountDataFrame = PoliticianWordCloudCalculator.calculate(spark, dataframe)

        val jsonifiedDataframe = politicianWordCountDataFrame.toJSON
        jsonifiedDataframe.show()

        jsonifiedDataframe.select($"value")
            .write
            .format("kafka")
            .option("kafka.bootstrap.servers", "queue-kafka-bootstrap:9092")
            .option("topic", "analytics-politician-word-cloud-created")
            .save()

        spark.stop()
    }
}
