var express = require("express");
var logfmt = require("logfmt");
var app = express();
var mongo = require('mongodb');

MongoClient = require('mongodb').MongoClient;
Server = require('mongodb').Server;

// var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var mongoUri = 'mongodb://hungdq:tonightshow@kahana.mongohq.com:10017/node';


MongoClient.connect(mongoUri, function(error, db){
	console.log("URI: " + mongoUri);
	if (error){
		console.log("Error: unable to connect to database");
		return;
	}
	console.log("Connected to database");
	db.collection('mydocs', function(er, collection) {
    	collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    		if (er==null) console.log("inserted");
    	});
  	});
});

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World! 1');
});

app.get('/blah', function(req, res){
	res.send('Blah World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});