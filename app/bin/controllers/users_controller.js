
var db = require('./db_controller.js');
var Promise = require('bluebird');
var session = require('./session_controller.js');

module.exports = {


    login: function(login, password, req, res) {

        db.getUser(login)
            .then(function(user){
                if (user) {
                    if (user.password === password) {
                        console.log('Poprawne has³o');
                        session.createSession(req, res, user);
                    } else
                        res.send('wrong password');
                } else
                db.saveUser(login, password)
                    .then(function(msg){
                        console.log(msg);
                    }).catch(function(error){
                        console.log(error);
                    })
            })
            .catch(function(error){
                console.log(error);
            });

    }
    
};