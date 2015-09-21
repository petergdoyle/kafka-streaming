var Jetty = require("jetty");
var through = require('through');

// Create a new Jetty object. This is a through stream with some additional
// methods on it. Additionally, connect it to process.stdout
var jetty = new Jetty(process.stdout);

// Clear the screen
jetty.clear();


var count = 0;
var avg = 0.00;
var total = 0;
var count = through(function(d) {
  count ++;
  total+=d.length;
  avg=total/count;
  jetty.moveTo([0,0]);
  jetty.text(
    'count:'.concat(count.toString())
    .concat(' total bytes:').concat(total.toString())
    .concat(' avg bytes:').concat(avg.toString())
  );
});

count.on('end', function() {
  console.log('\n');
});


var fs = require('fs');
var Split = require('split');
var zlib = require('zlib');
var Throttle = require('throttle');

var argv = require('optimist')
    .usage('Usage: $0 --fn=[compressed data file name] --kbps=[kilobytes per second]')
    .demand(['fn','kbps'])
    .argv;

var fn = argv.fn;
var kbps = argv.kbps;

var kb = 1024;

var streamer = function streamer(fn) {
  fs.createReadStream(fn)
    .pipe(zlib.createGunzip())
    .pipe(new Throttle(kbps * kb))
    .pipe(Split())
    .pipe(count)
    ;
}

streamer(fn);
