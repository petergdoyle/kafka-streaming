#!/bin/sh

KAFKA_HOME='/home/vagrant/kafka/default'

$KAFKA_HOME/bin/zookeeper-server-stop.sh
$KAFKA_HOME/bin/kafka-server-start.sh

nohup $KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties > kafka-zookeeper.out &
nohup $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties > kafka-server.out &
