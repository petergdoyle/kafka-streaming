

var numeral = require('numeral');

var argv = require('optimist')
    .usage('Usage: $0 --zk=[kafka_zk_0:2181] --topic=[kafka-topic] --partition=[kafka-partition] --attrs=[kafka-attributes]')
    .demand(['topic'])
    .argv;

var zk = argv.zk;
var consumer_topic = argv.topic;
var consumer_partition = argv.partition || 0;
var consumer_autoCommit = argv.ac || false;

var Jetty = require("jetty");
// Create a new Jetty object. This is a through stream with some additional
// methods on it. Additionally, connect it to process.stdout
var jetty = new Jetty(process.stdout);

var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client(zk),
consumer = new Consumer(
    client,
    [
        { topic: consumer_topic, partition: consumer_partition }
    ],
    {
        autoCommit: consumer_autoCommit
    }
);

var count = 0;
var total_bytes = 0;

// Clear the screen
jetty.clear();
jetty.moveTo([0,0]);
jetty.text("Stats for Kafka Topic '"+consumer_topic+"'");

consumer.on('message', function (message) {

  total_bytes+=message.value.length;
  count++;
  avg_size = total_bytes / count;
  jetty.moveTo([1,0]);
  jetty.text(
    'total_messages: '.concat(numeral(count,'0 a'))
    +'\navg_msg_size: '.concat(numeral(avg_size).format('0.00 b'))
    +'\ntotal_msg_volume: '.concat(numeral(total_bytes).format('0.00 b'))
    +'\n');
  jetty.clearLine();

});
