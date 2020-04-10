package com.voyce.common

import org.apache.spark.sql.SparkSession

trait SparkSessionTestWrapper {

    lazy val spark: SparkSession = {
        SparkSession
            .builder()
            .master("local[*]")
            .appName("Spark Test")
            .getOrCreate()
    }
}
