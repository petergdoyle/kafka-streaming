
var kafka = require('kafka-node');

var Consumer = kafka.Consumer;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = argv.topic || 'sentences';
var zk = argv.zk || 'kafka_zk_0:2181';
var client = new Client(zk);
var topics = [ { topic: topic }];
var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024 };
var consumer = new Consumer(client, topics, options);

consumer.on('message', function (message) {
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('error', err);
});
