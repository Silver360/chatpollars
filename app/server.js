var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    user = require('./bin/models/users.js'),
    msg = require('./bin/models/messages.js'),
    db = require('./bin/controllers/db_controller.js');


//app.http().io();
db.init(app);

require('./bin/routes.js').init(app, io);
server.listen(8080);

console.log('Nasluchuje na 8080');
