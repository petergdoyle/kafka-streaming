

var argv = require('optimist')
    .usage('Usage: $0 --topic=[kafka-topic name]')
    .demand(['topic'])
    .argv;

var topic = argv.topic;
var p = argv.p || 0;
var ac = argv.ac || false;


var express = require("express");
var app = express();

//Creating Router() object

var router = express.Router();
var host,port;

router.use(function(req,res,next) {
  console.log("" + req.baseUrl + " " + req.ip );
  next();
});

router.use("/topic/:topic",function(req,res,next){
  console.log(req.params.topic)
  if(req.params.topic == 'airshop') {
    res.json({"message" : "true"});
  }
  else next();
});

router.get("/",function(req,res){
  res.json({"message" : "Kafka Report App listening at http://"+host+":"+port});
});

app.use("/api",router);

var server = app.listen(3000, function () {
  host = server.address().address;
  port = server.address().port;
  console.log('Kafka Report App listening at http://%s:%s', host, port);
});


var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client(),
consumer = new Consumer(
    client,
    [
        { topic: topic, partition: p }
    ],
    {
        autoCommit: ac
    }
);

consumer.on('message', function (message) {
  console.log(message);
});
