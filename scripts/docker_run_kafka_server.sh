#!/bin/sh
docker run --name kafka_server_1 -h kafka_server_1 --link kafka_zk_0:kafka_zk_0 -p 9090:9090 -d petergdoyle/kafka:2.9 start-kafka-server.sh 1
