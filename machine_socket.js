var net = require('net');
var gcm = require('node-gcm');
var fs = require('fs');
var HOST = '0.0.0.0';
var PORT = 3000;

var server_api_key = 'AIzaSyBJsTgStuhvpKuX_0apoFvgxa8P3MyoPJU';
var sender = new gcm.Sender(server_api_key);
//var registrationIds = [];
//registrationIds.push(token);

require('./routes/dbconnection')();

module.exports = function() {
	
	net.createServer(function(sock) {

	    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	    // Add a 'data' event handler to this instance of socket
	    sock.on('data', function(data) {
	        var temp = data.toString().split('/');
	        switch(temp[0]) {
			case 'status':
				updateStatus(data);
				break;
	                default:
	                        break;
	        }
	        console.log('DATA ' + sock.remoteAddress + ': ' + data.toString());
	    });

	    // Add a 'close' event handler to this instance of socket
	    sock.on('close', function(data) {
	        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
	    });

	}).listen(PORT, HOST);
	
	function updateStatus(data) {
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
	
	function pushUrgentMessage(mid, temperature, humidity, pressure, statusCode) {
		console.log('pushUrgentMessage()');
                var sqlQuery = "SELECT distinct(token) from token where id IN(SELECT id FROM machineOwner where mid=?);";
                var queryParams = [mid];
                var registrationIds = [];
                connection.query(sqlQuery, queryParams, function(err, rows, fields) {
                        if(err) {
                                throw err;
                        }

                        //해당 기기를 등록한 모든 사용자에게 푸쉬를 보내기 위해 registrationIds 배열에 groupkey를 넣는다.
                        for(var i=0; i<rows.length; i=i+1) {
                                console.log(rows[i].token);
                                registrationIds.push(rows[i].token);
                        }
                        //해당 기기를 사용하는 유저가 없을 때 메시지를 보내지 않는다.
                        if(rows.length < 1) {
                                return;
                        }
                        //var message = new gcm.Message();
                        var date = new Date();
                        var message = new gcm.Message({
                                //collapseKey: 'collapseKey'+date,   //메시지 유실방지
                                delayWhileIdle: true,
                                timeToLive: 3,
                                data: {
                                title: 'lollaby 존나 개 위급상황',
                                message: '거의 뒤졌다고 보면 됨',
                                custom_key1: 'custom data1',
                                custom_key2: 'custom data2'
                                }
                        });

                        sender.send(message, registrationIds, 4, function (err, result) {
                            console.log(result);
                        });
                });
	}
}
