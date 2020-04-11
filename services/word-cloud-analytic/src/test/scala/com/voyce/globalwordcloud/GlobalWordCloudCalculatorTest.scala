package com.voyce.globalwordcloud

import com.voyce.common.{WordCount, SparkSessionTestWrapper, Tweet}
import org.scalatest.funsuite.AnyFunSuite

class GlobalWordCloudCalculatorTest extends AnyFunSuite with SparkSessionTestWrapper {

    import spark.implicits._

    test("Can create global word cloud") {
        val tweetDataSet = Seq(
            Tweet("Teststring text", "1", Set(1, 2)),
            Tweet("Teststring 2", "2", Set(1, 2)),
            Tweet("Teststring2 3", "3", Set(1, 2))
        ).toDS

        val result = GlobalWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Set[GlobalWordCloud] = Set(
            GlobalWordCloud(
                Set(
                    WordCount("2", 1),
                    WordCount("3", 1),
                    WordCount("text", 1),
                    WordCount("Teststring", 2),
                    WordCount("Teststring2", 1)
                )
            )
        )

        assert(result.collect().toSet === expected)
    }

    test("Does remove stop words") {
        val tweetDataSet = Seq(
            Tweet("I am awesome", "1", Set(1, 2)),
            Tweet("I am great", "2", Set(1, 2))
        ).toDS

        val result = GlobalWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Set[GlobalWordCloud] = Set(
            GlobalWordCloud(
                Set(
                    WordCount("awesome", 1),
                    WordCount("great", 1)
                )
            )
        )

        assert(result.collect().toSet === expected)
    }
}
