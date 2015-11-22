
var bodyParser = require('body-parser');


module.exports = {

    express: require('express'),
    userReq: require('./controllers/users_controller.js'),
    msgReq: require('./controllers/messages_controller.js'),
    sessionReq: require('./controllers/session_controller.js'),
    usersSocket: {},
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
        }).catch(function(e){
           console.log(e);
        });
    },
    login: function(data, io, userReq, sessionReq, socket){
        userReq.login(data.login, data.password).then(function(data){
            sessionReq.createSession(socket.request, data);
            module.exports.usersSocket[data.login] = socket.handshake.address;
            io.sockets.emit('login:res', 'access');
        }).catch(function(e){
            io.sockets.emit('login:res', '' + e);
        });
    },
    signin: function(data, io, userReq, sessionReq, socket){
        userReq.signin(data.login, data.password).then(function(data){
            sessionReq.createSession(socket.request, data);
            io.sockets.emit('login:res', 'access');
        }).catch(function(e){
            io.sockets.emit('login:res', '' + e);
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
            res.send({ res: 'access:go', user: { login: req.session.user.login, group: req.session.user.group } });
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
        getMessages: function(data, io, msgReq){
            io.sockets.emit('new:messages', msgReq.getMessages());
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
                })
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

            socket.on('login', function(data){ console.log('lgowanie');
                module.exports.login(data, io, userReq, sessionReq, socket);
            });

            socket.on('signin', function(data){
                module.exports.signin(data, io, userReq, sessionReq, socket);
            });

            socket.on('get:messages', function(data){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.getMessages(data, io, msgReq);
                }
            });

            socket.on('delete:messages', function(data, callback){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.deleteMessage(data, io, msgReq, socket, callback);
                }
            });

            socket.on('send:message', function(data){
                if(sessionReq.verificationSession(socket.request)) {
                    module.exports.messages.sendMessage(data, io, userReq, sessionReq, socket);
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
