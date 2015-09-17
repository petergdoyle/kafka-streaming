
var fs = require('fs');
var zlib = require('zlib');
var Split = require('split');


var fn = process.argv[2];

var split = Split();

var streamer = function streamer(fn) {
  fs.createReadStream(fn)
    .pipe(zlib.createGunzip())
    .pipe(split) // will split by newline so the .on('data') event will be a complete line rather than a buffer chunk
    .on('data', function (line) {
      console.log('emit para as message\n',line);
    })
    .on('end', function() {
      streamer(fn);
    })
    ;
}

streamer(fn);
