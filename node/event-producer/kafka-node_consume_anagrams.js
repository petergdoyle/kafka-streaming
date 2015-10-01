

var argv = require('optimist')
    .usage('Usage: $0 \
    --groupid=[req: kafka-node-group-0,1,2,3...] \
    --zk=[req: kafka_zk_0:2181] \
    --topic=[req: kafka-topic] \
    --serverport= [####, def:3000] \
    --partition=[0,1,2,3..., def: 0] \
    --autocommit=[ true|false, def:true] \
    --autocommitinterval=[ 500,1000,etc. ms, def:5000] \
    ')
    .demand(['groupid','zk','topic'])
    .argv;

var groupid = argv.groupid;
var zk = argv.zk;
var topic = argv.topic;
var serverport = argv.serverport || 3000;
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

var counter = 0;
var dict = {};
consumer.on('message', function (message) {
  counter++;
  var parts = message.value.split(',');
  var key = parts[0];
  var word = parts[1];
  var count = parts[2];
  var matching_key = (key in dict);
  if (matching_key) { // update an anagram entry with either a new word or update the count for that word
    all_words = dict[key];
    matching_word = (word in all_words);
    if (matching_word) { // add to that word count
      word_count = all_words[word];
      all_words[word] = word_count + parseInt(count);
    } else { // add that word to the set of words for that anagram and set count
      all_words[word] = parseInt(count);
    }
  } else {
    dict[key]={}; // new entry (object) for that anagram key
    all_words = dict[key]; // retrieve the new entry (object) with the key
    all_words[word] = parseInt(count); // set a property (value of word) with a value (count)
  }
});


var express = require("express");
var app = express();

var router = express.Router();
var host,port;

app.route('/anagrams')
  .get(function(req, res) {
    res.jsonp(dict);
  });

var server = app.listen(serverport, function () {
  host = server.address().address;
  port = server.address().port;
  console.log('Kafka Report App listening at http://%s:%s', host, port);
});
