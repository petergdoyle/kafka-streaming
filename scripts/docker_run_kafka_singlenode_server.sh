
#!/bin/sh

docker run --name kafka_singlenode_server -h kafka_singlenode_server --link kafka_singlenode_zk:kafka_singlenode_zk -d petergdoyle/kafka:2.9 start-kafka-singlenode.sh
