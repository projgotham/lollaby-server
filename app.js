var express = require('express');

var app = express();

app.get('/', function (req,res) {
	res.send('Hello Baby World!');
});

app.listen(80, function() {
	console.log('Server On!');
});
