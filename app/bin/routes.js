

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
        this.loginRest(this.app, this.userReq, this.sessionReq);
        this.logout(this.app, this.sessionReq);
        this.message(this.io, this.msgReq);
        this.messages(this.io, this.msgReq);
        this.findSession(this.app);
        this.authentication(this.app);
    },
    static: function(app){
        app.use( '/', this.express.static('./public') );
    },
    findSession: function(app){
        app.get( '/findSession', function(req, res){
            console.log('Moja Sesja: ', req.session);
            res.send(req.session);
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
    loginRest: function(app, userReq, sessionReq){
        app.post( '/login', function(req, res){

            req.session.user = { login: req.body.login, password: req.body.password }
            res.send(req.session.user);
            // userReq.login(req.body.login, req.body.password).then(function(data){
            //     if(data){
            //         req.session.user = { login: req.body.login, password: req.body.password }
            //         res.send(req.session.user);
            //         //sessionReq.createSession(req, data, res);
            //     }
            // }).catch(function(e){
            //     console.log('Err: ', e);
            //     res.redirect('/chat');
            // });
        });
    },
    logout: function(app, sessionReq){
        app.get( '/logout', function(req, res){
            console.log('Zosta³es wylogowany');
            sessionReq.destroySesssion(req, res);
        });
    },
    authentication: function(app){
        app.get( '/setSession', function(req, res){
            if (!req.session.user){
                req.session.user = { login: 'Renio', password: 'Renio?', count: 1 };
                res.send(req.session.user);
            } else {
                req.session.user = { login: 'Renio', password: 'Renio?', count: '1++' };
                res.send('Session: ' + req.session.user);
            }
        });

        // io.sockets.on('connection', function(socket){
        //     socket.on('authentication', function(data) {
        //         if (sessionReq.verificationSession(socket.request) == 'access') {
        //             console.log('Wszystko ok');
        //             io.sockets.emit('access', false);
        //         } else {
        //             if(data == '/login' || data == '/prelogin') {
        //                 console.log('Sesja nie jest aktywna ale mozesz tu byc :)');
        //             } else {
        //                 console.log('Jestes w niew³¹sciwym miejscu [SOCKETY]]');
        //                 io.sockets.emit('access:denied', false);
        //             }
        //         }
        //     });
        // });
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
