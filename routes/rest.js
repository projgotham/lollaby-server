var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

const selectUsersURL = ("/users");
const selectUsersQuery = ("SELECT * FROM user;");

const selectUserURL = ("/user/:id");
const selectUserQuery = ("SELECT * FROM user where id=?;");

const checkUserURL = ("/checkUser/:id/:password");
const checkUserQuery = ("SELECt count(*) FROM user where id=? and password=password(?)");

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
/*
router.get('/user', function(req, res) {
        var sqlQuery = "SELECT * FROM user";
	//connection.connect();
	connection.query(sqlQuery, function(err, rows, fields) {
                if(err) {
			//connection.end();
                        throw err;
                }
                jsonFormat.successRes(res, 'good', rows);
		//console.log(rowsToJson(rows));
                //res.send(rowsToJson(rows));
        });
});
*/
router.get('/user:id', function(req, res) {
        res.send({id:req.params.id, name: "The NAme", description: "description"});
});
router.post('/', function(req, res) {
	res.send();
});

/*
function rowsToJson(rows){

        var jsonObjectList = new Array();

        for(var i=0; i<rows.length;i++){
                var jsonObject = new Object();
                jsonObject.id = rows[i].id;
                jsonObject.password = rows[i].password;
                jsonObject.name = rows[i].name;
                jsonObjectList[i] = jsonObject;
                //console.log(rows[i].id+" | "+rows[i].password+" | "+rows[i].name);
                //console.log(jsonObjectList);
        }

        return jsonObjectList;
}
*/
module.exports = router;
