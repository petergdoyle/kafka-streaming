
var fs = require('fs');
var zlib = require('zlib');
var through = require('through');
var Split = require('split');


var argv = require('optimist')
    .usage('Usage: $0 --fn=[compressed data file name]')
    .demand(['fn'])
    .argv;
var fn = argv.fn;


var gunzip = zlib.createGunzip();
var split = Split();

var counter = 0;
var count = through(function(d) {
  counter ++;
});

count.on('end', function() {
  console.log(counter);
});

var streamer = function streamer(fn) {
  fs.createReadStream(fn)
  .pipe(gunzip)
  .pipe(split)
  .pipe(count)
  ;
}
streamer(fn);
