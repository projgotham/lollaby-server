/*
var express = require('express');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function (req,res) {
	//res.send('Hello Baby World!는 무슨 쉬바 이거 만드는데 3:47분까지 함\n');
	var output = [];
	output.push({name: 'lollaby', objective: '5 milion won', comment: 'Hello Baby World!'});
	res.send(output);
	console.log('app.get');
});

io.sockets.on('connection', function(socket) {
	console.log('sockets.io connection!');
});

app.listen(80, function() {
	console.log('Server On!');
});
*/
var net = require('net');
var gcm = require('node-gcm');
var fs = require('fs');

var HOST = '0.0.0.0';
var PORT = 80;

var server_api_key = 'AIzaSyBJsTgStuhvpKuX_0apoFvgxa8P3MyoPJU';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];
//var token = 'fm5-5GRg-dQ:APA91bENGD6CXes4K3dQPe02faCXHt9WoENIOwtesjOkqBjYrlVFbj3Iq0mBx8ZFr2WKcZw4nbXP3LfVyjwQtyDoArn1dC30Dc09_btiqNv9IGUOmticifHFHrYBHqyezVow-xPdI0kJI';
var token = 'd__dUIGN_MY:APA91bGN3idCP8J_TlTPkg545ptuMzG09QMmg86Fhg9Qs9SXnIt_rQtYy5h4G77Pfwg7VlV41O4cDAzT9QFs8AMJldeaskOwx1mTBjFjEyEn45-ETbNe3tTYc5bMX3Z2tL1jKsN3CaGX';
registrationIds.push(token);

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {

        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        var message = new gcm.Message();

	var message = new gcm.Message({
   		collapseKey: 'demo',
   		delayWhileIdle: true,
   	 	timeToLive: 3,
   	 	data: {
       		title: 'saltfactory GCM demo',
       		message: data+'',
		custom_key1: 'custom data1',
       		custom_key2: 'custom data2'
    		}
	});
	
	sender.send(message, registrationIds, 4, function (err, result) {
	    console.log(result);
	});

	// Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
