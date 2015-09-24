#!/bin/sh
if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} topic zk[default kafka_zk_0:2181] options[default --from-beginning]"
  exit 1
fi

topic=$1
zk=${2-"kafka_zk_0:2181"}
options=${3-"--from-beginning"}

$KAFKA_HOME/bin/kafka-console-consumer.sh --zookeeper $zk --topic $topic $options
