#!/bin/sh
if [ "$#" -ne 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} [topic]"
  exit 1
fi
topic=$1

$KAFKA_HOME/bin/kafka-console-producer.sh --broker-list kafka_server_0:9090 --topic $topic
