var net = require('net');
var HOST = '0.0.0.0';
var PORT = 5000;

require('./routes/dbconnection')();
var sleep = require('sleep');
var sleepTime = 5;

module.exports = function() {
	
	net.createServer(function(sock) {

		console.log('ANDROID CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		sock.write('aaaa');	
		sock.on('data', function(data) {
			console.log(data.toString());
			sock.write(data.toString());
		});
		
		// Add a 'close' event handler to this instance of socket
		sock.on('close', function(data) {
	        	console.log('ANDROID CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
		});

	}).listen(PORT, HOST);
	
	function selectStatus(data) {
		// 데이터는 status/기기번호/온도/습도/압력 순으로 온다.
		var dataList = data.toString().split('/');
		var mid = dataList[1];
		var temperature = Number(dataList[2]);
		var humidity = Number(dataList[3]);
		var pressure = Number(dataList[4]);
		var statusCode = 1; // 상태코드 1:안전
		if((temperature <= 10 || temperature >= 35) || (humidity <= 5 || humidity >= 30))
			statusCode = 2; //상태코드 2:경고
		if(pressure >= 50)
			statusCode = 3; //상태코드 3:위험
		
		var sqlQuery = "UPDATE machine SET status= ? , temperature = ?, humidity = ?, pressure = ?, date = now() where mid = ?;";
		var queryParams = [statusCode, temperature, humidity, pressure, mid];
		connection.query(sqlQuery, queryParams, function(err, rows, fields) {
			if(err) {
				throw err;
			}
			if(statusCode == 3) {	
				pushUrgentMessage(mid, temperature, humidity, pressure, statusCode);
			}
		});
	}
}
