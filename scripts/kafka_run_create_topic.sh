#!/bin/sh
if [ "$#" -ne 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} [topic]"
  exit 1
fi
topic=$1
$KAFKA_HOME/bin/kafka-topics.sh --create --zookeeper kafka_zk_0:2181 --replication-factor 1 --partitions 1 --topic $topic

$KAFKA_HOME/bin/kafka-topics.sh --list --zookeeper kafka_zk_0:2181
