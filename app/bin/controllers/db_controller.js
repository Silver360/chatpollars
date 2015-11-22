

//mongoose.disconnect();

var session = require('express-session'),
	MongoStore = require('connect-mongo')({session: session}),
	mongoose = require('mongoose'),
	conn = mongoose.connect('mongodb://localhost/PollarsDb'),
	User = mongoose.model('User'),
	BlackList = mongoose.model('BlackList'),
	Message = mongoose.model('Message'),
	Promise = require('bluebird');

module.exports = {

    init: function(app, io){
        return new Promise(function(resolve, reject) {
            mongoose.connection.on("open", function (err) {
                if (err) {
                    reject(err);
                } else {
                    var sessionMiddleware = session({
                        secret: 'LXNlc3Npb24gZGVwcmVjYXRlZCB1',
                        store: new MongoStore({
                            db: mongoose.connection.db,
                            collection: 'session'
                        }),
                        resave: true,
                        saveUninitialized: true
                    });
                    io.use(function(socket, next) {
                        sessionMiddleware(socket.request, socket.request.res, next);
                    });
                    app.use(sessionMiddleware);
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
            user.set('CtrlLogin', login);
            user.set('password', password);
            user.set('group', 'user');
            user.save(function(err){
                if(err){
                    reject(err);
                } else {
                    resolve('U�ytkownik zosta� dodany do bazy');
                }
            });
        });
    },
    addToBlackList: function(login, ip){
        return new Promise(function(resolve, reject){
            var blacklist = new BlackList();
            blacklist.set('login', login);
            blacklist.set('ip', ip);
            blacklist.set('date', new Date());
            blacklist.save(function(err){
                if(err){
                    reject(err);
                } else {
                    resolve( { login: login, ip: ip } );
                }
            });
        });
    },
    getBlackList: function(){
        return new Promise(function(resolve, reject){
            BlackList.find().exec(function (err, user) {
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
    removeFromBlackList: function(loginUser){
        return new Promise(function(resolve, reject){
            BlackList.remove( { login: loginUser }, true );
        });
    }

};



