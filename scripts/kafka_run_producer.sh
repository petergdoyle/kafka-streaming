#!/bin/sh
if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} topic kafka_broker_id[0,1,2,3...] port[909$broker_id]}"
  exit 1
fi

topic=$1
kafka_broker_id=${2-"0"}
port=${3-"909$kafka_broker_id"}

$KAFKA_HOME/bin/kafka-console-producer.sh --broker-list kafka_server_$kafka_broker_id:$port --topic $topic
