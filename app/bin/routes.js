
var bodyParser = require('body-parser');


module.exports = {

    express: require('express'),
	shortId: require('shortid'),
    userReq: require('./controllers/users_controller.js'),
    msgReq: require('./controllers/messages_controller.js'),
    sessionReq: require('./controllers/session_controller.js'),
    usersSocket: {},
    usersInChat: {},
    init: function(app, io){
        this.static(app);
        this.requestHandler(app, io, this.userReq, this.msgReq, this.sessionReq);
    },
    static: function(app){
        app.use( '/', this.express.static('./public') );
    },
    findSession: function(req, res, userReq){
        userReq.banAccount.blackList.update().then(function(data){ console.log(data);
            res.send( { session: req.session, Usoccket: data } );
			console.log('Users IN Chat', this.usersInChat);
			console.log('users Socket', this.usersSocket);
        }).catch(function(e){
           console.log(e);
        });
    },
    addUser: function(data, io, sessionReq, socket, callback){
		if(data != 'ren'){
			console.log('Wypierdalaj!'); 
			return;
		}
		
		var user = {
			login: 'Annon#' + module.exports.shortId.generate(),
			group: 'User'
		};
		
        this.usersInChat[user.login] = user;
        this.usersSocket[user.login] = socket;
        sessionReq.createSession(socket.request, user);
        callback( { res: 'access', user: { login: socket.request.session.req.session.user.login, group: socket.request.session.req.session.user.group } } );
        io.sockets.emit('users:change', Object.size(this.usersInChat));
    },
    removeUser: function(data, io, sessionReq, socket){
        delete this.usersInChat[data.login];
        io.sockets.emit('users:change', Object.size(this.usersInChat));
    },
    login: function(data, io, userReq, sessionReq, socket, callback){
        userReq.login(data.login, data.password).then(function(data){
            sessionReq.createSession(socket.request, data);
            module.exports.usersSocket[data.login] = socket.handshake.address;
            callback( { res: 'access', user: { login: socket.request.session.req.session.user.login, group: socket.request.session.req.session.user.group , avatar: socket.request.session.req.session.user.avatar } } );
            //io.sockets.emit('login:res', { res: 'access', user: { login: socket.request.session.req.session.user.login, group: socket.request.session.req.session.user.group } } );
        }).catch(function(e){
            io.sockets.emit('Error', '' + e);
            callback('' + e);
        });
    },
    signin: function(data, io, userReq, sessionReq, socket, callback){
        userReq.signin(data.login, data.password).then(function(data){ console.log('rejestracja: ', data );
            sessionReq.createSession(socket.request, data);
            callback( { res: 'access', user: { login: socket.request.session.req.session.user.login, group: socket.request.session.req.session.user.group , avatar: socket.request.session.req.session.user.avatar } } );
            //io.sockets.emit('login:res', 'access');
        }).catch(function(e){
            io.sockets.emit('Error', '' + e);
            callback('' + e);
        });
    },
    logout: function(req, res, sessionReq){
        console.log('Zosta�es wylogowany');
        sessionReq.destroySesssion(req, function(){
            res.redirect('/');
        });
    },
    authentication: function(req, res, sessionReq){
        if (sessionReq.verificationSession(req)) {
            console.log('Wszystko ok [REST]');
            res.send({ res: 'access:go', user: { login: req.session.user.login, group: req.session.user.group, avatar: req.session.user.avatar } } );
        } else {
            if(req.body.url == '/login' || req.body.url == '/prelogin') {
                console.log('Sesja nie jest aktywna ale mozesz tu byc :) [REST]');
            } else {
                console.log('Jestes w niew��sciwym miejscu [REST]');
                res.send({ res: 'access:denied', user: null});
            }
        }

        // Wersja pod Sockety

        // io.sockets.on('connection', function(socket){
        //     socket.on('authentication', function(data) {
        //         if (sessionReq.verificationSession(socket.request) === 'access') {
        //             console.log('Wszystko ok [SOCKETY]');
        //             io.sockets.emit('access:go', false);
        //         } else {
        //             if(data == '/login' || data == '/prelogin') {
        //                 console.log('Sesja nie jest aktywna ale mozesz tu byc :) [SOCKETY]');
        //             } else {
        //                 console.log('Jestes w niew��sciwym miejscu [SOCKETY]');
        //                 io.sockets.emit('access:denied', false);
        //             }
        //         }
        //     });
        // });
    },
    messages: {
        getMessages: function(msgReq, callback){
            //io.sockets.emit('new:messages', msgReq.getMessages());
            callback(msgReq.getMessages());
        },
        deleteMessage: function(data, io, msgReq, socket, callback){
            console.log(data);
            msgReq.deleteMessage(data, socket.request);
            io.sockets.emit('new:messages', msgReq.getMessages());
        },
        sendMessage: function(data, io, msgReq, sessionReq, socket){
            if(data === '/logout'){
                sessionReq.destroySesssion(socket.request, function(){
                    console.log('Wylogowany');
                    io.sockets.emit('access:denied', false);
                });
            } else {
                io.sockets.emit('new:message', msgReq.createMsg(data, socket.request));
            }
        }
    },
    sendCommand: function(data, io, userReq, sessionReq, socket, callback){
        if(data.split(' ')[0] === '/ban'){
            console.log('Banujemy: '+ data.split(' ')[1]);
            userReq.banAccount.ban(data.split(' ')[1], socket).then(function(){
                userReq.banAccount.blackList.update().then(function(data){
                }).catch(function(e){
                    io.sockets.emit('Error', e);
                });
            }).catch(function(e){
                io.sockets.emit('Error',  e);
            });
        } else if (data.split(' ')[0] === '/unban'){
            userReq.banAccount.unBand(data.split(' ')[1]).then(function(data){
            }).catch(function(e){
               io.sockets.emit('Error',  e);
            });
        } else if (data.split(' ')[0] === '/showB'){ console.log('DhowDb');
            callback(userReq.banAccount.blackList.getBlackList());
        }

    },
    requestHandler: function(app, io, userReq, msgReq, sessionReq){

        app.get( '/find', function(req, res){
            module.exports.findSession(req, res, userReq);
        });

        app.get( '/logout', function(req, res){
            module.exports.logout(req, res, sessionReq);
        }); 

        app.post( '/authentication', function(req, res){
            module.exports.authentication(req, res, sessionReq, io);
        }); 
		
		app.get( '/chat', function(req, res){
            res.redirect('/#/chat');
        });

         app.get( '/login', function(req, res){
             res.redirect('/#/login');
         });

        app.get( '/prelogin', function(req, res){
            res.redirect('/#/prelogin');
        });

        app.get( '/*', function(req, res){
            res.redirect('/');
        });

        io.sockets.on('connection', function(socket){
            socket.on('find', function(data){
                io.sockets.emit('done', socket.request.session);
            });

             socket.on('login', function(data, callback){ console.log('logowanie');
                 module.exports.login(data, io, userReq, sessionReq, socket, callback);
             });

            socket.on('prelogin', function(data, callback){ console.log('prelogin: ', data);
                if(data === "renifer"){
                    callback('pass:ok');
                } else {
                    callback('pass:failed');
                }
            });

             socket.on('signin', function(data, callback){
                 module.exports.signin(data, io, userReq, sessionReq, socket, callback);
             });

            socket.on('get:messages', function(data, callback){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.getMessages(msgReq, callback);
                }
            });

            socket.on('delete:messages', function(data, callback){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.deleteMessage(data, io, msgReq, socket, callback);
                }
            });

            socket.on('send:message', function(data){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.sendMessage(data, io, msgReq, sessionReq, socket);
                }
            });

            socket.on('send:command', function(data, callback){
                if(socket.request.session.user.group === 'admin') {
                    module.exports.sendCommand(data, io, userReq, sessionReq, socket, callback);
                }
            });


        });
        
    }
    
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
