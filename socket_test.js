var express = require('express')
//  , routes = require('./routes')
  , http = require('http');

var app = express();
var server = app.listen(80);
var io = require('socket.io').listen(server);

app.get('/', function (req,res) {
        //res.send('Hello Baby World!는 무슨 쉬바 이거 만드는데 3:47분까지 함\n');
        var output = [];
        output.push({name: 'lollaby', objective: '5 milion won', comment: 'Hello Baby World!'});
        res.send(output);
        console.log('app.get');
});


io.sockets.on('connection', function(socket) {
	socket.on('join', function(data) {
		console.log(data);
	});
	console.log('conne');
});
