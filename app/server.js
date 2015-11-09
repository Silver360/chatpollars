var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    user = require('./bin/models/users.js'),
    msg = require('./bin/models/messages.js'),
    db = require('./bin/controllers/db_controller.js'),
    bodyParser = require('body-parser'),
    session = require('express-session');


app.use(bodyParser.json({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

require('./bin/routes.js').init(app, io);

server.listen(4040, function(){
    console.log('Nasluchuje na porcie ' + this.address().port);
});
