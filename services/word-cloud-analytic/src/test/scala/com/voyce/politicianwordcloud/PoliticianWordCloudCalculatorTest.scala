package com.voyce.politicianwordcloud

import com.voyce.common.{SparkSessionTestWrapper, Tweet, WordCount}
import org.scalatest.funsuite.AnyFunSuite

class PoliticianWordCloudCalculatorTest extends AnyFunSuite with SparkSessionTestWrapper {

    import spark.implicits._

    test("Can create politician word cloud") {
        val tweetDataSet = Seq(
            Tweet("Teststring text", "1", Seq(1)),
            Tweet("Teststring 2", "2", Seq(1)),
            Tweet("Teststring2 3", "3", Seq(1)),
            Tweet("Teststring3 3", "3", Seq(2)),
            Tweet("Teststring3 3", "3", Seq(2))
        ).toDS

        val result = PoliticianWordCloudCalculator.calculate(spark, tweetDataSet)
        val expected: Seq[PoliticianWordCloud] = Seq(
            PoliticianWordCloud(
                1,
                Seq(
                    WordCount("Teststring", 2),
                    WordCount("Teststring2", 1)
                )
            ),
            PoliticianWordCloud(
                2,
                Seq(
                    WordCount("Teststring3", 2)
                )
            )
        )

        val resultSequence: Seq[PoliticianWordCloud] = result.collect().toSeq
        assert(resultSequence === expected)
    }
}
