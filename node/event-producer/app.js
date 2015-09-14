
var fs = require('fs');
var zlib = require('zlib');


  // take the name file to read from the command args
  var fn = process.argv[2];

  var gunzip = zlib.createGunzip();

  var streamer = function streamer (fn) {
    var stream = fs.createReadStream(fn)
      .on('data', function (chunk) {
          console.log('got %d bytes of data', chunk.length);
      })
      .on('end', function() {
        console.log('there will be no more data.');
        streamer(fn);
      })
      .on('error', function(err) {
        process.stderr.write(err);
      });
  }

  streamer(fn);
