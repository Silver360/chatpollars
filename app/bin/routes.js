
var msgReq = require('./controllers/users_controller.js');
var userReq = require('./controllers/messages_controller.js');
var bodyParser = require('body-parser');


module.exports = {

    app: {},
    express: require('express'),
    io: {},
    msgReq: require('./controllers/users_controller.js'),
    userReq: require('./controllers/messages_controller.js'),
    bodyParser: require('body-parser'),
    init: function(app, io){
        this.app = app;
        this.io = io;

        this.app.use(bodyParser.json({
            extended: true
        }));

        this.static(this.app);
        this.login(this.app, this.userReq);
        this.message(this.io);
    },
    static: function(app){
        app.use( '/', this.express.static('./public') );
    },
    login: function(app, userReq){
        app.post( '/login', function(req, res){
            userReq.login(req.body.login, req.body.password, req, res);
        });
    },
    message: function(io){
        io.sockets.on('connection', function(socket){
            socket.on('send message', function(data){
                io.sockets.emit('message', data);
            });
        });
    },




};
