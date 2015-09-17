#!/bin/sh

docker run --name kafka_zk_0 -h kafka_zk_0 -p 2181:2181 -d petergdoyle/kafka:2.9 start-kafka-zookeeper.sh
