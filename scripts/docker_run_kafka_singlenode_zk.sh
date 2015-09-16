
#!/bin/sh

docker run --name kafka_singlenode_zk -h kafka_singlenode_zk -p 2181:2181 -d petergdoyle/kafka:2.9 start-kafka-zookeeper.sh
