package com.voyce.common

import java.util.Properties

import org.apache.spark.SparkContext

import scala.io.Source

object ConfigReader {

    private final val accessKey = "fs.s3a.access.key"
    private final val secretKey = "fs.s3a.secret.key"
    private final val pathStyleAccess = "fs.s3a.path.style.access"
    private final val impl = "fs.s3a.impl"
    private final val endpoint = "fs.s3a.endpoint"
    private final val sslEnabled = "fs.s3a.connection.ssl.enabled"

    def load(sc: SparkContext): Unit = {
        val url = getClass.getResourceAsStream("application.properties")
        val properties: Properties = new Properties()

        val source = Source.fromInputStream(url)
        properties.load(source.bufferedReader())

        sc.hadoopConfiguration.set(accessKey, properties.getProperty(accessKey))
        sc.hadoopConfiguration.set(secretKey, properties.getProperty(secretKey))
        sc.hadoopConfiguration.set(pathStyleAccess, properties.getProperty(pathStyleAccess))
        sc.hadoopConfiguration.set(impl, properties.getProperty(impl))
        sc.hadoopConfiguration.set(endpoint, properties.getProperty(endpoint))
        sc.hadoopConfiguration.set(sslEnabled, properties.getProperty(sslEnabled))
    }
}
