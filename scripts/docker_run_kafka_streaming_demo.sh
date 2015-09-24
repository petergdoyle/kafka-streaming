

#interactive
docker run --rm -t -i --link kafka_server_0:kafka_server_0 --link kafka_zk_0:kafka_zk_0 node/kafka-streaming /bin/bash

./kafka_run_create_topic.sh sentences
./kafka_run_create_topic.sh even-word-count
./kafka_run_create_topic.sh odd-word-count

#daemon
docker run -d -t -i -h kafka-node_producer_0 --name kafka-node_producer_0 --link kafka_server_0:kafka_server_0 --link kafka_zk_0:kafka_zk_0 node/kafka-streaming node kafka-node_producer.js --fn=lorem-ipsum-1Mb.gz --kbps=250 --topic=sentences
