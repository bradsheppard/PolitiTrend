package com.voyce.politicianwordcloud

import com.voyce.common.{Tweet, WordCount}
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions.{col, collect_list, explode, row_number, split, udf}
import org.apache.spark.sql.{Dataset, SparkSession}

object PoliticianWordCloudCalculator {

    def calculate(spark: SparkSession, tweetDataset: Dataset[Tweet]): Dataset[PoliticianWordCloud] = {
        import spark.implicits._

        val makeWord = udf((word: String, count: Long) => WordCount(word, count))

        val w = Window.partitionBy($"politician").orderBy($"count".desc)

        var wordCountDataFrame: Dataset[PoliticianWordCount] = tweetDataset
            .withColumn("word",
                explode(
                    split($"tweetText", "\\s+")
                )
            )
            .withColumn("politician", explode($"politicians"))

            .groupBy("word", "politician")
            .count().as[PoliticianWordCount]

        wordCountDataFrame = wordCountDataFrame
            .filter(x => x.word.length() >= 5)
            .withColumn("row_number", row_number.over(w))
            .where($"row_number" <= 10).as[PoliticianWordCount]

        val politicianWordCountDataFrame: Dataset[PoliticianWordCloud] = wordCountDataFrame.groupBy($"politician")
            .agg(
                collect_list(
                    makeWord(col("word"), col("count"))
                ).as("words").as[Set[WordCount]]
            ).as[PoliticianWordCloud]

        politicianWordCountDataFrame
    }
}
