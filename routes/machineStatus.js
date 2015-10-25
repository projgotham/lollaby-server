var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();
require('./gcm')();

/**
 * machine status update
 * input  : mid, temperature, humidity, noise, pressure
 * output : 없음
 */
const updateStatusURL = ('/:mid/:temperature/:humidity/:noise/:pressure');
const updateStatusQuery = ("UPDATE machine SET status= ?, temperature = ?, humidity = ?, noise = ?,  pressure = ?, date = now() where mid = ?;");

router.post(updateStatusURL, updateStatus);
function updateStatus(req, res, next) {
        const mid = req.params.mid;
        const temperature = req.params.temperature;
	const humidity = req.params.humidity;
	const noise = req.params.noise;
	const pressure = req.params.pressure;
	var statusCode = 1; // 상태코드 1:안전
                if((temperature <= 10 || temperature >= 35) || (humidity <= 5 || humidity >= 30))
                        statusCode = 2; //상태코드 2:경고
                if(pressure >= 50)
                        statusCode = 3; //상태코드 3:위험

        const queryParams = [statusCode, temperature, humidity, noise, pressure, mid];
        connection.query(updateStatusQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
        	if(statusCode == 3) {
			pushUrgentMessage(mid, temperature, humidity, noise, pressure, statusCode);
		}
		jsonFormat.successRes(res, 'updateStatus', req.body);
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
			//timeToLive: 3,
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

module.exports = router;
