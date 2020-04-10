name := "word-cloud-analytic"

version := "1.0"

scalaVersion := "2.11.11"

libraryDependencies += "org.apache.spark" %% "spark-sql" % "2.4.5" % "provided"
libraryDependencies += "org.apache.spark" % "spark-streaming_2.11" % "2.4.5" % "provided"
libraryDependencies += "org.apache.spark" % "spark-sql-kafka-0-10_2.11" % "2.4.5"
libraryDependencies += "org.apache.spark" % "spark-mllib_2.11" % "2.4.5"
libraryDependencies += "org.scalatest" % "scalatest_2.11" % "3.1.1" % "test"

libraryDependencies += "com.amazonaws" % "aws-java-sdk" % "1.7.4"
libraryDependencies += "org.apache.hadoop" % "hadoop-common" % "2.7.3"

unmanagedBase := baseDirectory.value / "lib"

assemblyMergeStrategy in assembly := {
  case "META-INF/services/org.apache.spark.sql.sources.DataSourceRegister" => MergeStrategy.concat
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}
