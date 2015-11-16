
var bodyParser = require('body-parser');


module.exports = {

    app: {},
    express: require('express'),
    io: {},
    userReq: require('./controllers/users_controller.js'),
    msgReq: require('./controllers/messages_controller.js'),
    sessionReq: require('./controllers/session_controller.js'),
    init: function(app, io){
        this.app = app;
        this.io = io;

        this.static(this.app);
        this.login(this.io, this.userReq, this.sessionReq);
        this.logout(this.app, this.sessionReq);
        this.message(this.io, this.msgReq, this.sessionReq);
        this.messages(this.io, this.msgReq);
        this.authentication(this.app, this.sessionReq, this.io);
        this.findSession(this.app, this.io);
        this.requestHandler(this.app);
        this.signin(this.io, this.userReq, this.sessionReq);
    },
    static: function(app){
        app.use( '/', this.express.static('./public') );
    },
    findSession: function(app, io){
        app.get( '/find', function(req, res){
            res.send(req.session);
        });

        io.sockets.on('connection', function(socket){
            socket.on('find', function(data){
                io.sockets.emit('done', socket.request.session);
            });
        });
    },
    login: function(io, userReq, sessionReq){
        io.sockets.on('connection', function(socket){
            socket.on('login', function(data){
                userReq.login(data.login, data.password).then(function(data){
                    sessionReq.createSession(socket.request, data);
                    io.sockets.emit('login:res', 'access');
                }).catch(function(e){
                    io.sockets.emit('login:res', '' + e);
                });
            });
        });
    },
    signin: function(io, userReq, sessionReq){
        io.sockets.on('connection', function(socket){
            socket.on('signin', function(data){
                userReq.signin(data.login, data.password).then(function(data){
                    sessionReq.createSession(socket.request, data);
                    io.sockets.emit('login:res', 'access');
                }).catch(function(e){
                    io.sockets.emit('login:res', '' + e);
                });
            });
        });
    },
    logout: function(app, sessionReq){
        app.get( '/logout', function(req, res){
            console.log('Zosta�es wylogowany');
            sessionReq.destroySesssion(req, function(){
                res.redirect('/');
            });

        });
    },
    authentication: function(app, sessionReq, io){

        app.get( '/authentication', function(req, res){
            if(sessionReq.verificationSession(req) === 'access'){
                console.log('Acccess:go [REST]');
                res.send('access:go');
            } else {
                console.log('Acccess:deneid [REST]');
                res.send('access:deneid')
            }
        });

        io.sockets.on('connection', function(socket){
            socket.on('authentication', function(data) {
                if (sessionReq.verificationSession(socket.request) === 'access') {
                    console.log('Wszystko ok [SOCKETY]');
                    io.sockets.emit('access:go', false);
                } else {
                    if(data == '/login' || data == '/prelogin') {
                        console.log('Sesja nie jest aktywna ale mozesz tu byc :) [SOCKETY]');
                    } else {
                        console.log('Jestes w niew��sciwym miejscu [SOCKETY]');
                        io.sockets.emit('access:denied', false);
                    }
                }
            });
        });
    },
    messages: function(io, msgReq){
      io.sockets.on('connection', function(socket){
          socket.on('get:messages', function(data){
              io.sockets.emit('new:messages', msgReq.getMessages());
          });
      });
    },
    message: function(io, msgReq, sessionReq){
        io.sockets.on('connection', function(socket){
            socket.on('send:message', function(data){
                if(data === '/logout'){
                    sessionReq.destroySesssion(socket.request, function(){
                        console.log('Wylogowany');
                        io.sockets.emit('access:denied', false);
                    });
                } else {
                    io.sockets.emit('new:message', msgReq.createMsg(data, socket.request));
                }
            });
        });
    },
    requestHandler: function(app){
        app.get( '/chat', function(req, res){
            res.redirect('/#/chat');
        });

        app.get( '/login', function(req, res){
            res.redirect('/#/login');
        });

        app.get( '/prelogin', function(req, res){
            res.redirect('/#/prelogin');
        });

        app.all( '/*', function(req, res){
            res.redirect('/');
        });
    }


};
