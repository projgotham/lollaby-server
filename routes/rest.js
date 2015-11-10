var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 전체 유저정보 select
 * input  : 없음
 * output : id, password, name, groupkey
 */
const selectUsersURL = ("/users");
const selectUsersQuery = ("SELECT * FROM user;");

/**
 * 특정 유저정보 select
 * input  : id
 * output : id, password, name, groupkey
 */
const selectUserURL = ("/user/:id");
const selectUserQuery = ("SELECT * FROM user where id=?;");

/**
 * 유저 id와 패스워드가 일치하는 지 확인
 * input  : id, password
 * output : count(하나의 행을 리턴하고 맞을 시에 1, 틀리면 0)
 */
const checkUserURL = ("/checkUser/:id/:password");
const checkUserQuery = ("SELECT count(*) AS count FROM user where id=? and password=password(?)");

/**
 * ID의 존재여부 확인
 * input  : id
 * output : count(하나의 행을 리턴하고 있으면 1이상, 없으면 0)
 */
const checkUserIdURL = ("/checkUserId/:id");
const checkUserIdQuery = ("SELECT count(*) AS count FROM user where id=?");

/**
 * 해당 id가 소유한 기기들의 상태를 select
 * input  : id
 * output : mid, status, statusNm, temperature, humidity, pressure, date
 */
const selectStatusByIdURL = ("/selectStatusById/:id");
const selectStatusByIdQuery = ("SELECT A.mid, A.status, (SELECT cdNm from code where cdGroup='status' and cd=A.status) as statusNm, A.temperature, A.humidity, A.noise, A.pressure, A.date FROM machine A where A.mid IN(SELECT mid FROM machineOwner where id = ?);");

/**
 * 해당 기기의 상태를 select
 * input  : mid
 * output : mid, status, statusNm, temperature, humidity, pressure, date
 */
const selectStatusURL = ("/selectStatus/:mid");
const selectStatusQuery = ("SELECT A.mid, A.status, (SELECT cdNm from code where cdGroup='status' and cd=A.status) as statusNm, A.temperature, A.humidity, A.noise, A.pressure, A.date FROM machine A where A.mid=?;");

/**
 * 해당 id 해당 기기의 token insert
 * input  : id, token
 * output : 없음
 */
const insertTokenURL = ("/insertToken/:id/:token");
const insertTokenQuery = ("INSERT INTO token (id, token) VALUES(?, ?)");

/**
 * 해당 id 해당 기기의 token 존재하는지 select
 * input  : id, token
 * output : count (하나의 행에 개수를 리턴)
 */
const selectTokenQuery = ("SELECT count(*) AS count FROM token where id=? and token=?");

router.get(selectUsersURL, selectUsers);
function selectUsers(req, res, next) {
	connection.query(selectUsersQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectUsers', rows);
        });
}

router.get(selectUserURL, selectUser);
function selectUser(req, res, next) {
	const id = req.params.id;
        const queryParams = [id];
        connection.query(selectUserQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectUser', rows);
        });
}

router.get(checkUserURL, checkUser);
function checkUser(req, res, next) {
	const id = req.params.id;
	const password = req.params.password;
	const queryParams = [id, password];
	connection.query(checkUserQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'checkUser', rows);
        });
}

router.get(checkUserIdURL, checkUserId);
function checkUserId(req, res, next) {
	const id = req.params.id;
	const queryParams = [id];
	connection.query(checkUserIdQuery, queryParams, function(err, rows, fields) {
		if(err) {
			throw err;
		}
		jsonFormat.successRes(res, 'checkUserId', rows);
	});
}

router.get(selectStatusByIdURL, selectStatusById);
function selectStatusById(req, res, next) {
	const id = req.params.id;
	const queryParams = [id];
	connection.query(selectStatusByIdQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectStatusById', rows);
        });
}

router.get(selectStatusURL, selectStatus);
function selectStatus(req, res, next) {
	const mid = req.params.mid;
        const queryParams = [mid];
        connection.query(selectStatusQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectStatus', rows);
        });
}

router.post(insertTokenURL, insertToken);
function insertToken(req, res, next) {
	const id = req.params.id;
	const token = req.params.token;
	const queryParams = [id, token];
	connection.query(selectTokenQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
		console.log("tokencount="+rows[0].count);
		if(rows[0].count < 1)
			insertToken2(req, res, next);
		else
			jsonFormat.successRes(res, 'insertToken', req.body);	
        });
}
function insertToken2(req, res, next) {
	const id = req.params.id;
        const token = req.params.token;
        const queryParams = [id, token];
        connection.query(insertTokenQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
        	jsonFormat.successRes(res, 'insertToken2', req.body);
	});
}

router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
