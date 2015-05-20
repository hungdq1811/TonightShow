var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

app.get("/", function(req, res){
	res.send("It Works!");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function(socket){
// 	socket.emit('user_register', {message: 'welcome'});
	socket.on('user_register', function(data){
	console.log(data);
		io.sockets.emit('user_register', {message: 'user_register'});
	});
});
