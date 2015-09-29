

var argv = require('optimist')
    .usage('Usage: $0 \
    --groupid=[req: kafka-node-group-0,1,2,3...] \
    --zk=[req: kafka_zk_0:2181] \
    --topic=[req: kafka-topic] \
    --partition=[def: 0] \
    --autocommit=[ true|false, def:true] \
    --autocommitinterval=[ 500,1000,etc. ms, def:5000] \
    ')
    .demand(['groupid','zk','topic'])
    .argv;

var groupid = argv.groupid;
var zk = argv.zk;
var topic = argv.topic;
var partition = argv.partition || 0;
var autocommit = argv.autocommit || true;
var autocommitinterval = argv.autocommitinterval || 5000;

var options = {
    //consumer group id, default `kafka-node-group`
    groupId: groupid,
    // Auto commit config
    //autocommit.enable	true	if set to true,
    //  the consumer periodically commits to zookeeper the latest consumed offset of each partition.
    //autocommit.interval.ms	10000
    //  is the frequency that the consumed offsets are committed to zookeeper.
    autoCommit: autocommit,
    autoCommitIntervalMs: autocommitinterval,
    // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
    fetchMaxWaitMs: 100,
    // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
    fetchMinBytes: 1,
    // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
    fetchMaxBytes: 1024 * 10,
    // If set true, consumer will fetch message from the given offset in the payloads
    fromOffset: false,
    // If set to 'buffer', values will be returned as raw buffer objects.
    encoding: 'utf8'
}

var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client(zk),
consumer = new Consumer(
    client,
    [
        {
          topic: topic,
          partition: partition
        }
    ],
    options
);

var PADDING = "0000000000".length;

Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
}

var HighLevelProducer = kafka.HighLevelProducer;
var client2 = new kafka.Client(zk);
var producer = new HighLevelProducer(client2,{ requireAcks: 1 });
producer.on('error', function (err) {
  console.log('error', err);
});

var count = 0;

consumer.on('message', function (message) {
  console.log(message.topic);
  count++;
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
  producer_partition = 0;
  producer_attrs = 0;
  producer_message = (v.length).pad(PADDING)+message.value;
  producer_topic = (v.length % 2 ) ? "odd-wordcount" : "even-wordcount";

  var payload =
      {
        topic: producer_topic,
        partition: producer_partition,
        messages: [producer_message],
        attributes: producer_attrs
      };
  console.log(payload);
  
  producer.send([payload], function (err, result) {
      console.log(err || result);
  });

});
