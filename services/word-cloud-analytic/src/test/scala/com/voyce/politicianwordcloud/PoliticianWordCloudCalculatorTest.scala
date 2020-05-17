package com.voyce.politicianwordcloud

import com.voyce.common.{SparkSessionTestWrapper, Tweet, WordCount}
import org.scalatest.funsuite.AnyFunSuite

class PoliticianWordCloudCalculatorTest extends AnyFunSuite with SparkSessionTestWrapper {

    import spark.implicits._

    test("Can create politician word cloud") {
        val tweetDataSet = Seq(
            Tweet("#Teststring text", "1", Set(1)),
            Tweet("#Teststring 2", "2", Set(1)),
            Tweet("#Teststring2 3", "3", Set(1)),
            Tweet("#Teststring3 3", "3", Set(2)),
            Tweet("#Teststring3 3", "3", Set(2))
        ).toDS

        val result = PoliticianWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Set[PoliticianWordCloud] = Set(
            PoliticianWordCloud(
                1,
                Set(
                    WordCount("#Teststring", 2),
                    WordCount("#Teststring2", 1)
                )
            ),
            PoliticianWordCloud(
                2,
                Set(
                    WordCount("#Teststring3", 2)
                )
            )
        )

        val resultSequence: Set[PoliticianWordCloud] = result.collect().toSet
        assert(resultSequence === expected)
    }
}
