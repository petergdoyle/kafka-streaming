#!/bin/sh
if [ "$#" -ne 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} [topic]"
  exit 1
fi
topic=$1
$KAFKA_HOME/bin/kafka-console-consumer.sh --zookeeper kafka_zk_0:2181 --topic $topic --from-beginning
