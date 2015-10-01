

var numeral = require('numeral');

var argv = require('optimist')
    .usage('Usage: $0 \
    --groupid=[req: kafka-node-group-0,1,2,3...] \
    --zk=[req: kafka_zk_0:2181] \
    --topic=[req: kafka-topic] \
    --partition=[def: 0] \
    --autocommit=[ true|false, def:true] \
    --autocommitinterval=[ 500,1000,etc. ms, def:5000] \
    --serverport [####, def:3000] \
    ')
    .demand(['groupid','zk','topic'])
    .argv;

var groupid = argv.groupid;
var zk = argv.zk;
var topic = argv.topic;
var partition = argv.partition || 0;
var autocommit = argv.autocommit || true;
var autocommitinterval = argv.autocommitinterval || 5000;
var serverport = argv.serverport || 3000;

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

var count = 0;
var total_bytes = 0;

var Jetty = require("jetty");
// Create a new Jetty object. This is a through stream with some additional
// methods on it. Additionally, connect it to process.stdout
var jetty = new Jetty(process.stdout);
// Clear the screen
jetty.clear();
jetty.moveTo([0,0]);
jetty.text("Stats for Kafka Topic '"+topic+"'");

function stats(message) {
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
}

consumer.on('message', function(message) {
    stats(message);
});
consumer.on('error', function(err) {
  console.log(err);
});


/*
// web part
var express = require("express");
var app = express();

var router = express.Router();
var host,port;

router.use(function(req,res,next) {
  console.log("" + req.baseUrl + " " + req.ip );
  next();
});

router.use("/topic/:topic",function(req,res,next){
  console.log(req.params.topic)
  if(req.params.topic == 'airshop') {
    res.json({"message" : "true"});
  }
  else next();
});

router.get("/",function(req,res){
  res.json({"message" : "Kafka Report App listening at http://"+host+":"+port});
});

app.use("/api",router);

var server = app.listen(serverport, function () {
  host = server.address().address;
  port = server.address().port;
  console.log('Kafka Report App listening at http://%s:%s', host, port);
});
*/
