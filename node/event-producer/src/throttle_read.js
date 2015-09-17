
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
    .on('data', function (line) {
      process.stdout.write(line);
    })
    .on('end', function() {
      process.stdout.write('\n\nDONE!!!\n\n');
      streamer(fn);
    })
    ;
}

streamer(fn);
