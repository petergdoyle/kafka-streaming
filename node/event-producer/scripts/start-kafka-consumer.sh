#!/bin/sh

KAFKA_HOME='/home/vagrant/kafka/default'


$KAFKA_HOME/bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic airshop --from-beginning
