

var argv = require('optimist')
    .usage('Usage: $0 --topic=[kafka-topic name]')
    .demand(['topic'])
    .argv;

var topic = argv.topic;
var p = argv.p || 0;
var ac = argv.ac || false;


var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client(),
consumer = new Consumer(
    client,
    [
        { topic: topic, partition: p }
    ],
    {
        autoCommit: ac
    }
);

consumer.on('message', function (message) {
  console.log(message);
});
