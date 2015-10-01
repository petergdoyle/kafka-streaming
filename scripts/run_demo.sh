

docker ps -a

docker stop kafka_server_0
docker stop kafka_zk_0
docker rm kafka_server_0 kafka_zk_0



cd /vagrant/node/scripts/

./docker_run_kafka_zk.sh 0
./docker_run_kafka_server.sh 0


./kafka_run_consumer.sh paragraphs
./kafka_run_consumer.sh even-wordcount
./kafka_run_consumer.sh odd-wordcount
./kafka_run_consumer.sh anagram

cd /vagrant/node/event-producer/

#Consumers
node kafka-node_consumer_stats.js --groupid=node_consumer_stats_paragraphs_0 --zk=kafka_zk_0:2181 --topic=paragraphs

node kafka-node_consumer_stats.js --groupid=node_consumer_stats_even-wordcount_0 --zk=kafka_zk_0:2181 --topic=even-wordcount

node kafka-node_consumer_stats.js --groupid=node_consumer_stats_odd-wordcount_0 --zk=kafka_zk_0:2181 --topic=odd-wordcount

node kafka-node_consumer_stats.js --groupid=node_consumer_stats_anagram_0 --zk=kafka_zk_0:2181 --topic=anagram

node kafka-node_consume_anagrams.js --groupid=node_consumer_consume_anagrams_0 --zk=kafka_zk_0:2181 --topic=anagram

#Consumer-Producers

node kafka-node_consumer_split_odd_even.js --groupid=consumer_split_odd_even_0 --zk=kafka_zk_0:2181 --topic=paragraphs

node kafka-node_consumer_emit_anagrams.js --groupid=node_consumer_emit_anagrams_0 --zk kafka_zk_0:2181 --topic=paragraphs



#Producer
node kafka-node_highlevel_producer.js --zk=kafka_zk_0:2181 --fn=lorem-ipsum-1para.gz --kbps=250 --topic=paragraphs --continuous=3
