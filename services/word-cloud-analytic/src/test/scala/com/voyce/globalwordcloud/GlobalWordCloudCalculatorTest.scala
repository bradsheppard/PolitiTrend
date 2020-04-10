package com.voyce.globalwordcloud

import com.voyce.common.{WordCount, SparkSessionTestWrapper, Tweet}
import org.scalatest.funsuite.AnyFunSuite

class GlobalWordCloudCalculatorTest extends AnyFunSuite with SparkSessionTestWrapper {

    import spark.implicits._

    test("Can create global word cloud") {
        val tweetDataSet = Seq(
            Tweet("Teststring text", "1", Seq(1, 2)),
            Tweet("Teststring 2", "2", Seq(1, 2)),
            Tweet("Teststring2 3", "3", Seq(1, 2))
        ).toDS

        val result = GlobalWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Seq[GlobalWordCloud] = Seq(
            GlobalWordCloud(
                Seq(
                    WordCount("Teststring", 2),
                    WordCount("Teststring2", 1)
                )
            )
        )

        val resultSequence: Seq[GlobalWordCloud] = result.collect().toSeq
        assert(resultSequence === expected)
    }
}
