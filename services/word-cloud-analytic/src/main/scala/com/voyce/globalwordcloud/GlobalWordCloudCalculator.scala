package com.voyce.globalwordcloud

import com.voyce.common.{Tweet, WordCount}
import org.apache.spark.ml.feature.StopWordsRemover
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, SparkSession}

object GlobalWordCloudCalculator {

    def calculate(spark: SparkSession, tweetDataset: Dataset[Tweet]): Dataset[GlobalWordCloud] = {

        import spark.implicits._

        val makeWord = udf((word: String, count: Long) => WordCount(word, count))

        val remover = new StopWordsRemover()
            .setInputCol("words")
            .setOutputCol("filteredWords")

        var tweetWordArrayDataset = tweetDataset.withColumn("words", split($"tweetText", "\\s+"))
        tweetWordArrayDataset = remover.transform(tweetWordArrayDataset)

        var wordCountDataFrame: Dataset[WordCount] = tweetWordArrayDataset
            .withColumn("word", explode($"filteredWords"))
            .groupBy("word")
            .count().as[WordCount]

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
