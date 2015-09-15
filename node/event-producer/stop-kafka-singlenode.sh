#!/bin/sh

KAFKA_HOME='/home/vagrant/kafka/default'

$KAFKA_HOME/bin/kafka-server-stop.sh
$KAFKA_HOME/bin/zookeeper-server-stop.sh
