
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

var stripPunctuation = through(function(d) {
  this.queue(d.toString().replace(/[\.,-\/#!$%\^&amp;\*;:{}=\-_`~()]/g, ''));
});

var separateWords = through(function(d) {
  this.queue(d.toString().replace(/ /g, '\n'));
});

var split = Split();

var filter = through(function(d) {
  if (d.match(/exercittion/i)) this.queue(d);
});

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
  .pipe(stripPunctuation)
  .pipe(separateWords)
  .pipe(split)
  //.pipe(filter)
  .pipe(count)
  //.pipe(process.stdout)
  ;
}
streamer(fn);
