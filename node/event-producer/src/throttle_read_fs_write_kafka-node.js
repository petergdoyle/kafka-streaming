
var fs = require('fs');
var Split = require('split');
var kafka = require('kafka-node');
var zlib = require('zlib');
var Throttle = require('throttle');

var argv = require('optimist')
    .usage('Usage: $0 --fn=[compressed data file name] --kbps=[kilobytes per second] --topic=[kafka-topic name]')
    .demand(['fn','kbps','topic'])
    .argv;

var fn = argv.fn;
var topic = argv.topic;
var p = argv.p || 0;
var a = argv.a || 0;
var kbps = argv.kbps;

var kb = 1024;

var Producer = kafka.Producer;
var Client = kafka.Client;

var streamer = function streamer(fn) {
  var client = new Client('localhost:2181');
  var producer = new Producer(client, { requireAcks: 1 });
  fs.createReadStream(fn)
    .pipe(zlib.createGunzip())
    //.pipe(new Throttle(kbps * kb))
    .pipe(Split())
    .on('data', function (line) {
      //process.stdout.write('\nLINE\n');

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
      //process.stdout.write('\nDONE\n');
      streamer(fn);
    })
    ;
}

streamer(fn);
