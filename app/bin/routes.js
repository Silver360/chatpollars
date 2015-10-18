
var express = require('express');
var msgReq = require('./controllers/users_controller.js');
var userReq = require('./controllers/messages_controller.js');
var bodyParser = require('body-parser');

module.exports = {

    init: function(app){
        app.use(bodyParser.json({
            extended: true
        }));

        this.static(app);
        this.login(app);
        this.message(app);
    },
    static: function(app){
        app.use( '/', express.static('./public') );
    },
    login: function(app){
        app.post( '/login', function(req, res){
            userReq.login(req.body.login, req.body.password, req, res);
        });
    },
    message: function(app){
        app.get( '/msg', function(res){
            msgReq.getMsg(res);
        });
    }



};