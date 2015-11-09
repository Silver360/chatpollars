

//mongoose.disconnect();

var session = require('express-session');
var mongoStore = require('connect-mongo')({session: session});
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/PollarsDb');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Promise = require('bluebird');

module.exports = {

    init: function(app, io){
        return new Promise(function(resolve, reject) {
            mongoose.connection.on("open", function (err) {
                if (err) {
                    reject(err);
                } else {
                    app.use(session({
                        secret: 'keyboard cat',
                        resave: false,
                        saveUninitialized: true
                    }));
                    // io.use(function(socket, next) {
                    //     sessionMiddleware(socket.request, socket.request.res, next);
                    // });
                    resolve('Object Session Create');
                }
            });
        });
    },
    getUser: function(login){
        return new Promise(function(resolve, reject){
            User.findOne({ login: login }).exec(function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    if (!user) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                }
            });
        });
    },
    saveUser: function(login, password){
        return new Promise(function(resolve, reject){
            var user = new User();
            user.set('login', login);
            user.set('password', password);
            user.set('group', 'user');
            user.save(function(err){
                if(err){
                    reject(err);
                } else {
                    resolve('U¿ytkownik zosta³ dodany do bazy');
                }
            })
        });
    },
    getMsg: function(){
        return new Promise(function(resolve, reject){
            Message.find().limit(5).exec(function(err, messages){
               if(!messages){
                   reject(err);
               } else {
                    resolve(messages);
               }
            });
        });
    }

};
