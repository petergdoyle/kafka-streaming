
var fs = require('fs');
var Split = require('split');
var zlib = require('zlib');
var Throttle = require('throttle');
var kafka = require('kafka-node');


var argv = require('optimist')
    .usage('Usage: $0 --zk=[kafka_zk_0:2181] --fn=[compressed data file name] --kbps=[kilobytes per second] --topic=[kafka-topic name] --continuous=[true|false or a specific number of times to loop on the file]')
    .demand(['zk', 'fn','kbps','topic','continuous'])
    .argv;

var zk = argv.zk;
var fn = argv.fn;
var topic = argv.topic;
var p = argv.p || 0;
var a = argv.a || 0;
var kbps = argv.kbps;
var continuous,max_recursion;
if (isNaN(argv.continuous)) {
    continuous = argv.continuous;
} else {
  max_recursion = parseInt(argv.continuous);
}

var kb = 1024;
var recursion_count = 0;


var HighLevelProducer = kafka.HighLevelProducer;
var client = new kafka.Client(zk);

var streamer = function streamer(fn,producer) {
  recursion_count++;

  fs.createReadStream(fn)
    .pipe(zlib.createGunzip())
    .pipe(new Throttle(kbps * kb))
    .pipe(Split())
    .on('data', function (line) {

      producer.on('ready', function () {
          var message = line;
          producer.send([
              { topic: topic, partition: p, messages: [message], attributes: a }
          ], function (err, result) {
              console.log(err || result);
          });
      });

    })
    .on('end', function() {
      if (continuous === 'false') {
      } else if (continuous === 'true' || recursion_count < max_recursion) {
        console.log("recursion", recursion_count);
        streamer(fn,producer);
      }
    })
    .on('close', function(err) {
      console.log('Stream has been destroyed and file has been closed');
    })
    .on('error', function(err) {
      console.log(err);
    })
    ;
}

streamer(fn,new HighLevelProducer(client));
