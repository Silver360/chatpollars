var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    user = require('./bin/models/users.js'),
    msg = require('./bin/models/messages.js'),
    db = require('./bin/controllers/db_controller.js'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

app.use(bodyParser.json({ extended: true }));
db.init(app, io).then(function(data){

    console.log(data);
    require('./bin/routes.js').init(app, io);
    server.listen(4040);

    server.listen(4040, function(){
        console.log('Nasluchuje na porcie ' + this.address().port);
    });

});




