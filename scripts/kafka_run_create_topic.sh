#!/bin/sh
if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0]} topic zk[default kafka_zk_0:2181] replication_factor[default 1] partitions[default 1]"
  exit 1
fi

topic=$1
zk=${2-"kafka_zk_0:2181"}
replication_factor=${3-"1"}
partitions=${4-"1"}

$KAFKA_HOME/bin/kafka-topics.sh --create --zookeeper $zk --replication-factor 1 --partitions 1 --topic $topic

$KAFKA_HOME/bin/kafka-topics.sh --list --zookeeper $zk
