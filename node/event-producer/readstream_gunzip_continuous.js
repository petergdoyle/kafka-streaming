
var fs = require('fs');
var zlib = require('zlib');

var argv = require('optimist')
    .usage('Usage: $0 --fn=[compressed data file name]')
    .demand(['fn'])
    .argv;

var fn = argv.fn;

var streamer = function streamer(fn) {
  fs.createReadStream(fn)
    .on('end', function() {
      streamer(fn);
    })
    .pipe(zlib.createGunzip())
    .pipe(process.stdout)
    ;
}

streamer(fn);
