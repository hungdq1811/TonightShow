var express = require("express");
var app = express();
var port = 3000;

app.get("/", function(req, res){
	res.send("It Works!");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function(socket){
	socket.emit('user_register', {message: 'welcome'});
	socket.on('send', function(data){
		io.sockets.emit('message', data);
	});
});
