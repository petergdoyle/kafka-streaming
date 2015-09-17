
var fs = require('fs');
var zlib = require('zlib');
var Split = require('split');
var kafka = require('kafka-node');
var Throttle = require('throttle');

var argv = require('optimist')
    .usage('Usage: $0 --fn=[compressed data file name] --topic=[kafka-topic name]')
    .demand(['fn','topic'])
    .argv;
var topic = argv.topic;
var p = argv.p || 0;
var a = argv.a || 0;
var bps = argv.bps || 10;
var fn = argv.fn;

var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var producer = new Producer(client, { requireAcks: 1 });

var split = Split();
var kb = 1024;
var throttle = new Throttle(bps * kb);

var streamer = function streamer(fn) {
  fs.createReadStream(fn)
    .on('end', function() {
      streamer(fn);
    })
    //.pipe(throttle)
    .pipe(zlib.createGunzip())
    .pipe(split) // will split by newline so the .on('data') event will be a complete line rather than a buffer chunk
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
    ;
}

streamer(fn);
