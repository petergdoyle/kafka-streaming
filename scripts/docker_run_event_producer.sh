#!/bin/sh

docker run --rm -t -i -h node_event_producer_0 --link kafka_server_0:kafka_server_0 --link kafka_zk_0:kafka_zk_0 node/event-producer /bin/bash
