package com.polititrend.globalwordcloud

import com.polititrend.common.{Tweet, WordCount}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, SparkSession}

object GlobalWordCloudCalculator {

    def calculate(spark: SparkSession, tweetDataset: Dataset[Tweet]): Dataset[GlobalWordCloud] = {

        import spark.implicits._

        val makeWord = udf((word: String, count: Long) => WordCount(word, count))

        val tweetWordArrayDataset = tweetDataset.withColumn("words", split($"tweetText", "\\s+"))

        var wordCountDataFrame: Dataset[WordCount] = tweetWordArrayDataset
            .withColumn("word", explode($"words"))
            .groupBy("word")
            .count().as[WordCount]
            .filter(x => x.word.startsWith("#"))

        wordCountDataFrame = wordCountDataFrame
            .orderBy($"count".desc)
            .limit(20).as[WordCount]

        val politicianWordCountDataFrame: Dataset[GlobalWordCloud] = wordCountDataFrame
            .agg(
                collect_list(
                    makeWord(col("word"), col("count"))
                ).as("words").as[Set[WordCount]]
            ).as[GlobalWordCloud]

        politicianWordCountDataFrame
    }
}
