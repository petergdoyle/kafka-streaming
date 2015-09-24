
docker stop kafka-node_producer_0 kafka_server_0 kafka_zk_0  

./docker_run_kafka_zk.sh 0
./docker_run_kafka_server.sh 0

./kafka_run_create_topic.sh sentences
./kafka_run_create_topic.sh even-words
./kafka_run_create_topic.sh odd-words
./kafka_run_create_topic.sh words
./kafka_run_create_topic.sh word

#daemon
docker run -d -t -i -h kafka-node_producer_0 --name kafka-node_producer_0 --link kafka_server_0:kafka_server_0 --link kafka_zk_0:kafka_zk_0 node/kafka-streaming node kafka-node_producer.js --fn=lorem-ipsum-1Mb.gz --kbps=250 --topic=sentences
