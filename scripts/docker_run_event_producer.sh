#!/bin/sh

if [ "$#" -lt 1 ]
then
  echo "Usage: ${BASH_SOURCE[0] instance_id[0,1,2,3...] kafka_broker_id[0,1,2,3...] kafka_zk_id[default 0,1,2,3...]]"
  exit 1
fi

instance_id=${1-"0"}
kafka_broker_id=${2-"0"}
kafka_zk_id=${3="0"}

docker run --rm -t -i -h node_event_producer_$instance_id --link kafka_server_$kafka_broker_id:kafka_server_$kafka_broker_id --link kafka_zk_$kafka_zk_id:kafka_zk_$kafka_zk_id node/event-producer /bin/bash
