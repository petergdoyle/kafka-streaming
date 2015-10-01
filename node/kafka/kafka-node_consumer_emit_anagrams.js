

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


var HighLevelProducer = kafka.HighLevelProducer;
var client2 = new kafka.Client(zk);
var producer = new HighLevelProducer(client2,{ requireAcks: 1 });
producer_partition = 0;
producer_attrs = 0;
producer.on('error', function (err) {
  console.log('error', err);
});

var count = 0;

consumer.on('message', function (message) {
  count++;
/*
  message produces:
  { topic: 'paragraphs',
    value: 'The application would have to somehow execute this function on all pairs of words in the input. However fast this method would be, the overall execution would still take quite some time.',
    offset: 0,
    partition: 0,
    key: -1 }
*/

  // remove punctuation and split the paragraph into words
  var words = message.value
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .split(' ');

  // build up an array of anagrams to be sent as a group of messages to kafka
  var messages = [];
  for (i=0; i < words.length; i++) {
    var word = words[i];
    // the key is the sorted characters in the word
    // two words with the same characters in any order case insensitive will
    // then have the same key
    // those words then are said to be anagrams of each other
    var key = word.toLowerCase()/*concerned about letters not case*/.split('').sort(
      function (a, b)
        {
           var ret = 0;
           if(a > b)
              ret = 1;
           if(a < b)
              ret = -1;
           return ret;
        }
      ).join('');
    var message = [key,word,1].toString();
    messages.push(message);
  }

  var payload =
      {
        topic: 'anagram',
        partition: producer_partition,
        messages: messages,
        attributes: producer_attrs
      };
  //console.log(payload);
  producer.send([payload], function (err, result) {
      console.log(err || result);
  });
});
