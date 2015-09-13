


**word-count** read a gzip'd text file of random sentences and count the words. This program demonstrates the basic stream pipelining facility in node.js with some additional features like Transform and Split, etc. It can also be modified to look for a specific word. This is an excellent first step towards writing something to consume a real-time stream of data and produce a Tuple based feed into a Storm Spout to count words or filter words, etc.

```javascript

var fs = require('fs');
var zlib = require('zlib');
var through = require('through');
var Split = require('split');


var fn = process.argv[2];  // take the command line provide file name
var stream = fs.createReadStream(fn);
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

stream  // this is the really powerful feature - not having to build all the in-memory data structures and process them separately but to build a streaming io pipeline !!!
  .pipe(gunzip)
  .pipe(stripPunctuation)
  .pipe(separateWords)
  .pipe(split)
  //.pipe(filter)
  .pipe(count)
  //.pipe(process.stdout)
  ;

```

General Usage:Produce a gzip'd lorem-ipsum file using the lorem-ipsum node module.
```console
$ npm install lorem-ipsum --global
$ lorem-ipsum 3000 paragraphs |sed '/^\s*$/d' |gzip > lorem-ipsum-1Mb.gz
```
Run the work-count program. The result of the word
```console
$ node simple_word_count.js lorem-ipsum-1Mb.gz
2408
```

Docker Usage: produce a 1Mb lorem-ipsum file using a Docker container
```console
$ docker build -t node/event-producer .
$ docker run -it --rm --name lorem-ipsum node/lorem-ipsum 30000 paragraphs |sed '/^\s*$/d' | gzip > lorem-ipsum-10Mb.gz
$ docker run -it --rm -v $PWD:/shared node/event-producer /shared/lorem-ipsum-10Mb.gz
```
