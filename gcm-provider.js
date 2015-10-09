var gcm = require('node-gcm');
var fs = require('fs');

var message = new gcm.Message();

var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        title: 'saltfactory GCM demo',
        message: 'Google Cloud Messaging 테스트',
        custom_key1: 'custom data1',
        custom_key2: 'custom data2'
    }
});

var server_api_key = 'AIzaSyBJsTgStuhvpKuX_0apoFvgxa8P3MyoPJU';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = 'fm5-5GRg-dQ:APA91bENGD6CXes4K3dQPe02faCXHt9WoENIOwtesjOkqBjYrlVFbj3Iq0mBx8ZFr2WKcZw4nbXP3LfVyjwQtyDoArn1dC30Dc09_btiqNv9IGUOmtcifHFHrYBHqyezVow-xPdI0kJI';
registrationIds.push(token);

sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});
