#!/bin/sh
if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} zk[default kafka_zk_0:2181]"
  exit 1
fi

zk=${1-"kafka_zk_0:2181"}

$KAFKA_HOME/bin/kafka-topics.sh --list --zookeeper $zk
