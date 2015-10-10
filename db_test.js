var mysql = require("mysql");
var connection = mysql.createConnection({
    host : "lollaby-db.cwijkp7jx3jn.ap-northeast-1.rds.amazonaws.com",
    port : 3306,
    user : "master",
    password : "masterpw",
    database : "lollaby"
});
var sqlQuery = "SELECT * FROM user";

function callback(err,rows, fields){
    if(err){
        throw err
    }    
    for(var i=0; i<rows.length;i++){
        console.log(rows[i].id+" | "+rows[i].password+" | "+rows[i].name);
    }
}
 
connection.connect();
connection.query(sqlQuery, callback);
connection.end();
