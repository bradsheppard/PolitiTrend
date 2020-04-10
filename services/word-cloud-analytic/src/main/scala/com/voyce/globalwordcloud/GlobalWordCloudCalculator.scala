package com.voyce.globalwordcloud

import com.voyce.common.{WordCount, Tweet}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, SparkSession}

object GlobalWordCloudCalculator {

    def calculate(spark: SparkSession, tweetDataset: Dataset[Tweet]): Dataset[GlobalWordCloud] = {

        import spark.implicits._

        val makeWord = udf((word: String, count: Long) => WordCount(word, count))

        var wordCountDataFrame: Dataset[WordCount] = tweetDataset
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

        val politicianWordCountDataFrame: Dataset[GlobalWordCloud] = wordCountDataFrame
            .agg(
                collect_list(
                    makeWord(col("word"), col("count"))
                ).as("words").as[Set[WordCount]]
            ).as[GlobalWordCloud]

        politicianWordCountDataFrame
    }
}
