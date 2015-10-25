module.exports = function() {
	this.gcm = require('node-gcm');
	this.server_api_key = 'AIzaSyBJsTgStuhvpKuX_0apoFvgxa8P3MyoPJU';
	this.sender = new gcm.Sender(server_api_key);
};    
