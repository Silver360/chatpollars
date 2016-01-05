

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

    avatars: [
        ['avatar1.jpg', '#b11b1c'],
        ['avatar2.png', 'black'],
        ['avatar3.png', '#343434'],
        ['avatar4.png', '#2EB7FF'],
        ['avatar5.jpg', 'black'],
        ['avatar6.jpg', 'black'],
        ['avatar7.jpg', '#c04438'],
        ['avatar8.jpg', '#9d0b0e'],
        ['avatar9.jpg', '#1e2c35'],
        ['avatar10.jpg', 'black'],
        ['avatar11.png', '#662c92'],
        ['avatar12.png', '#2c2c2e']
    ],
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
            var random = Math.floor((Math.random() * 12) + 1); console.log('Random: ', random);
            var user = new User();
            user.set('login', login);
            user.set('password', password);
            user.set('group', 'user');
            user.set('avatar', { url: module.exports.avatars[random][0], color: module.exports.avatars[random][1] });
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



