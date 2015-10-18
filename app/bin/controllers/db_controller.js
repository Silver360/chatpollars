

//mongoose.disconnect();

var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/PollarsDb');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Promise = require('bluebird');

module.exports = {
    init: function(app){
        mongoose.connection.on("open", function(err) {
            if(err){
                console.log(err);
            } else {
                app.use(expressSession({
                    secret: 'SECRET',
                    cookie: {maxAge: 60 * 60 * 1000},
                    store: new mongoStore({
                        db: mongoose.connection.db,
                        collection: 'session'
                    }),
                    resave: true,
                    saveUninitialized: true
                }))
            }
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



