#!/bin/sh

if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} zk_instance_id [0,1,2,3... default 0] port[#### default 2181]"
  exit 1
fi

zk_instance_id=${1-"0"}
zk_instance_port=${2-"2181"}

docker run --name kafka_zk_$zk_instance_id -h kafka_zk_$zk_instance_id -p $zk_instance_port:$zk_instance_port -d petergdoyle/kafka:2.9 start-kafka-zookeeper.sh

if [ $? -eq 0 ]
then
  echo "docker container kafka_zk_$zk_instance_id created"
  exit 0
else
  echo "Could not create container" >&2
  exit 1
fi
