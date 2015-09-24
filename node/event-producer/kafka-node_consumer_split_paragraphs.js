

var argv = require('optimist')
    .usage('Usage: $0 --topic=[kafka-topic] --partition=[kafka-partition] --attrs=[kafka-attributes] --autoCommit=[true|false]')
    .demand(['topic'])
    .argv;

var consumer_topic = argv.topic;
var consumer_partition = argv.partition || 0;
var consumer_attrs = argv.attrs || 0;
var consumer_autoCommit = argv.autoCommit || false;


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

Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
}

consumer.on('message', function (message) {

/*
  message produces:
  { topic: 'paragraphs',
    value: 'The application would have to somehow execute this function on all pairs of words in the input. However fast this method would be, the overall execution would still take quite some time.',
    offset: 0,
    partition: 0,
    key: -1 }
*/
  var v = message.value
  .replace(/[^\w\s]|_/g, "")
  .replace(/\s+/g, " ")
  .split(' ');

  var producer = new kafka.Producer(new kafka.Client('kafka_zk_0:2181'),{ requireAcks: 1 });
  producer_partition = 0;
  producer_attrs = 0;
  producer_message = (v.length).pad(PADDING)+message.value;
  producer_topic = (v.length % 2 ) ? "odd-words" : "even-words";

  producer.on('ready', function () {
    console.log("emitting to ",producer_topic);
    producer.send([
        { topic: producer_topic, partition: producer_partition, messages: [producer_message], attributes: producer_attrs }
      ], function (err, result) {
          console.log(err || result);
      });
  });

});
