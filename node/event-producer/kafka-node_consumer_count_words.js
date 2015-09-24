

var argv = require('optimist')
    .usage('Usage: $0 --topic=[kafka-topic] --partition=[kafka-partition] --attrs=[kafka-attributes]')
    .demand(['topic'])
    .argv;

var consumer_topic = argv.topic;
var consumer_partition = argv.partition || 0;
var consumer_attrs = argv.attrs || 0;

var Jetty = require("jetty");
// Create a new Jetty object. This is a through stream with some additional
// methods on it. Additionally, connect it to process.stdout
var jetty = new Jetty(process.stdout);
// Clear the screen
jetty.clear();


var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client('kafka_zk_0:2181'),
consumer = new Consumer(
    client,
    [
        { topic: consumer_topic, partition: consumer_partition }
    ],
    {
        autoCommit: consumer_autoCommit
    }
);

var PADDING = "1000000".length;

consumer.on('message', function (message) {

  jetty.moveTo([0,0]);
  jetty.text(
    'count:'.concat(message.subString(0,PADDING))
  );


});
