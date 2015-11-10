
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
        this.message(this.io, this.msgReq);
        this.messages(this.io, this.msgReq);
//        this.authentication(this.app, this.sessionReq, this.io);
        this.findSession(this.app);
        this.loginRest(this.app, this.userReq, this.sessionReq)
        this.findSockets(this.io);
    },
    static: function(app){
        app.use( '/', this.express.static('./public') );
    },
    findSession: function(app){
        app.get( '/find', function(req, res){
            console.log('Session tutaj here i nic wiecej : ', req.session);
            res.send(req.session);
        });
    },
    findSockets: function(io){
        io.sockets.on('connection', function(socket){
            socket.on('find', function(data){
                console.log('Socket: ', this.request.session);
                io.sockets.emit('done', this.request.session);
            });
        });
    },
    login: function(io, userReq, sessionReq){
        io.sockets.on('connection', function(socket){
            socket.on('login', function(data){
                this.request.session.user = { login: data.login, password: data.password };
                console.log('Done: ', this.request.session.user)
                // userReq.login(data.login, data.password).then(function(data){
                //     sessionReq.createSession(socket.request, data);
                //     io.sockets.emit('login:res', 'access');
                // }).catch(function(e){
                //     io.sockets.emit('login:res', '' + e);
                // });
            });
        });
    },
    loginRest: function(app, userReq, sessionReq){
        app.get( '/setSession', function(req, res){
            req.session.user = { login: 'Renio', password: 'Renio?' }
            res.send(req.session.user);
        });
    },
    logout: function(app, sessionReq){
        app.get( '/logout', function(req, res){
            console.log('Zosta³es wylogowany');
            sessionReq.destroySesssion(req, res);
        });
    },
    authentication: function(app, sessionReq, io){
        app.use( '/', function(req, res){
            if(sessionReq.verificationSession(req) == 'no-access' ){
                console.log('Jestes w niew³¹sciwym miejscu [REST]');
                res.redirect('/');
            }
        });

        io.sockets.on('connection', function(socket){
            socket.on('authentication', function(data) {
                if (sessionReq.verificationSession(socket.request) == 'access') {
                    console.log('Wszystko ok');
                    io.sockets.emit('access', false);
                } else {
                    if(data == '/login' || data == '/prelogin') {
                        console.log('Sesja nie jest aktywna ale mozesz tu byc :)');
                    } else {
                        console.log('Jestes w niew³¹sciwym miejscu [SOCKETY]]');
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
    message: function(io, msgReq){
        io.sockets.on('connection', function(socket){
            socket.on('send:message', function(data){
                io.sockets.emit('new:message', msgReq.createMsg(data));
            });
        });
    }




};
