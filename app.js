var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var rest = require('./routes/rest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/rest', rest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//-----------------------------------------------------------
var net = require('net');
var gcm = require('node-gcm');
var fs = require('fs');

var HOST = '0.0.0.0';
var PORT = 3000;

var server_api_key = 'AIzaSyBJsTgStuhvpKuX_0apoFvgxa8P3MyoPJU';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = 'd__dUIGN_MY:APA91bGN3idCP8J_TlTPkg545ptuMzG09QMmg86Fhg9Qs9SXnIt_rQtYy5h4G77Pfwg7VlV41O4cDAzT9QFs8AMJldeaskOwx1mTBjFjEyEn45-ETbNe3tTYc5bMX3Z2tL1jKsN3CaGX';
registrationIds.push(token);

var mysql = require("mysql");
var connection = mysql.createConnection({
                host : "lollaby-db.cwijkp7jx3jn.ap-northeast-1.rds.amazonaws.com",
                port : 3306,
                user : "master",
                password : "masterpw",
                database : "lollaby"
});

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var temp = data.toString().split('/');
        switch(temp[0]) {
                case 'push':
                        sendMessage(data);
                        break;
                case 'query':
                        executeQuery(data, sock);
                        //while(selectFlag==true) {};
                        //console.log('jsonObjectList: ' +jsonObjectList);
                        //sock.write(jsonObjectList);
                        break;
                default:
                        break;
        }
        console.log('DATA ' + sock.remoteAddress + ': ' + data.toString());

        // Write the data back to the socket, the client will receive it as data from the server
        //sock.write('You said "' + data + '"');

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

function sendMessage(data) {
        console.log('sendMessage()');
        //var message = new gcm.Message();
        var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3,
                data: {
                title: 'saltfactory GCM demo',
                message: data.toString().split('/')[1],
                custom_key1: 'custom data1',
                custom_key2: 'custom data2'
                }
        });

        sender.send(message, registrationIds, 4, function (err, result) {
            console.log(result);
        });
}

function executeQuery(data, sock) {
        console.log('executeQuery');

        var sqlQuery = "SELECT * FROM user";
        connection.connect();
        connection.query(sqlQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                //console.log('The solution is: ', rows);
                console.log(rowsToJson(rows));
                sock.write('good');
		//sock.write(rowsToJson(rows));
        });

        connection.end();
}

function rowsToJson(rows){

        var jsonObjectList = new Array();

        for(var i=0; i<rows.length;i++){
                var jsonObject = new Object();
                jsonObject.id = rows[i].id;
                jsonObject.password = rows[i].password;
                jsonObject.name = rows[i].name;
                jsonObjectList[i] = jsonObject;
                console.log(rows[i].id+" | "+rows[i].password+" | "+rows[i].name);
                //console.log(jsonObjectList);
        }

        return jsonObjectList;
}

console.log('Server listening on ' + HOST +':'+ PORT);

module.exports = app;
