var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    user = require('./bin/models/users.js'),
    msg = require('./bin/models/messages.js'),
    db = require('./bin/controllers/db_controller.js'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

app.use(bodyParser());
app.use(cookieParser('MAGICString'));
app.use(session());

//app.http().io();
db.init(app);



require('./bin/routes.js').init(app, io);
server.listen(4040);

console.log('Nasluchuje na 4040');
