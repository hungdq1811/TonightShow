var express = require("express");
var logfmt = require("logfmt");
var app = express();
var mongo = require('mongodb');

MongoClient = require('mongodb').MongoClient;
Server = require('mongodb').Server;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

mongo.Db.connect(mongoUri, function(error, db){
	db.collection('mydocs', function(err, collection){
		collection.insert({"key":"value"}, {safe: true}, function(err, rs){
			//none
		});
	});
});

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World! 1');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});