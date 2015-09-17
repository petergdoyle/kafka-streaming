#!/bin/sh

docker start kafka_zk_0
wait %1
docker start kafka_server_0 kafka_server_1 kafka_server_2 
