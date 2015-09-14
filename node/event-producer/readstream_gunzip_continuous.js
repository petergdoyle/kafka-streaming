
var fs = require('fs');
var zlib = require('zlib');

var fn = process.argv[2];

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
