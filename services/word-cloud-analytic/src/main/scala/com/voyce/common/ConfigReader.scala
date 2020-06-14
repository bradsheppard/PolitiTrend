package com.voyce.common

import java.io.{File, InputStream}
import java.util.Properties

import org.apache.spark.SparkContext

import scala.io.{BufferedSource, Source}

class ConfigReader {

    private val url: InputStream = getClass.getResourceAsStream("/application.properties")
    private val properties: Properties = new Properties ()

    private val source: BufferedSource = Source.fromInputStream(url)
    properties.load(source.bufferedReader())

    private final val ACCESS_KEY = "fs.s3a.access.key"
    private final val SECRET_KEY = "fs.s3a.secret.key"
    private final val PATH_STYLE_ACCESS = "fs.s3a.path.style.access"
    private final val IMPL = "fs.s3a.impl"
    private final val ENDPOINT = "fs.s3a.endpoint"
    private final val SSL_ENABLED = "fs.s3a.connection.ssl.enabled"

    private final val LOOKBACK = "lookback"

    def getLookback(): Int = {
        Integer.parseInt(properties.getProperty(LOOKBACK))
    }

    def load(sc: SparkContext): Unit = {
        sc.hadoopConfiguration.set(ACCESS_KEY, properties.getProperty(ACCESS_KEY))
        sc.hadoopConfiguration.set(SECRET_KEY, properties.getProperty(SECRET_KEY))
        sc.hadoopConfiguration.set(PATH_STYLE_ACCESS, properties.getProperty(PATH_STYLE_ACCESS))
        sc.hadoopConfiguration.set(IMPL, properties.getProperty(IMPL))
        sc.hadoopConfiguration.set(ENDPOINT, properties.getProperty(ENDPOINT))
        sc.hadoopConfiguration.set(SSL_ENABLED, properties.getProperty(SSL_ENABLED))
    }
}
