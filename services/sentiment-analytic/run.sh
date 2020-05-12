#!/bin/sh

spark-submit \
	--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.4.5 \
	app.py

