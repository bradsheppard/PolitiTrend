package com.polititrend.politicianwordcloud

import com.polititrend.common.{ConfigReader, PathTranslator, Tweet}
import org.apache.spark.sql.{DataFrame, SparkSession}

object PoliticianWordCloudAnalytic {

    def main(args: Array[String]) {
        val spark = SparkSession.builder
            .appName("Politician Word Cloud")
            .getOrCreate()

        import spark.implicits._

        val sc = spark.sparkContext
        val configReader = new ConfigReader()
        configReader.load(sc)

        val lookback = configReader.getLookback()
        val paths = (0 to lookback).toList.map(x => PathTranslator.getS3Path(x))

        var optionalDataframe: Option[DataFrame] = None

        for(path <- paths) {
            try {
                val currentDataframe: DataFrame = spark.read.json(path)
                if(optionalDataframe.isEmpty) {
                    optionalDataframe = Option.apply(currentDataframe)
                }
                else {
                    optionalDataframe.get.union(currentDataframe)
                }
            }
            catch {
                case e: Exception =>
                    println(e)
            }
        }

        val dataframe = optionalDataframe.get.as[Tweet].persist()

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
