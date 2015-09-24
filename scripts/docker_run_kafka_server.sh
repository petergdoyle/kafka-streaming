#!/bin/sh

if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0] broker_id[0,1,2,3...] zk[default kafka_zk_0] port[909$broker_id]}"
  exit 1
fi

broker_id=${1-"0"}
zk=${2-"kafka_zk_0"}
port=${3-"909$broker_id"}

docker run --name kafka_server_$broker_id -h kafka_server_$broker_id --link $zk:$zk -p $port:$port -d petergdoyle/kafka:2.9 start-kafka-server.sh $broker_id
