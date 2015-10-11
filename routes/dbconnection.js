module.exports = function() { 
	this.connection = require('mysql').createConnection({
                host : "lollaby-db.cwijkp7jx3jn.ap-northeast-1.rds.amazonaws.com",
                port : 3306,
                user : "master",
                password : "masterpw",
                database : "lollaby",
		charset  : "utf8"
	});
};
