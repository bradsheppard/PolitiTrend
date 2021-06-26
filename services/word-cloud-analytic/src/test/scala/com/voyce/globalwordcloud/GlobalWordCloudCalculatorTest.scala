package com.polititrend.globalwordcloud

import com.polititrend.common.{WordCount, SparkSessionTestWrapper, Tweet}
import org.scalatest.funsuite.AnyFunSuite

class GlobalWordCloudCalculatorTest extends AnyFunSuite with SparkSessionTestWrapper {

    import spark.implicits._

    test("Can create global word cloud") {
        val tweetDataSet = Seq(
            Tweet("#Teststring text", "1", Set(1, 2)),
            Tweet("#Teststring 2", "2", Set(1, 2)),
            Tweet("Teststring2 #3", "3", Set(1, 2))
        ).toDS

        val result = GlobalWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Set[GlobalWordCloud] = Set(
            GlobalWordCloud(
                Set(
                    WordCount("#3", 1),
                    WordCount("#Teststring", 2)
                )
            )
        )

        assert(result.collect().toSet === expected)
    }
}
