
var db = require('./db_controller.js');
var Promise = require('bluebird');
var session = require('./session_controller.js');

module.exports = {

    login: function(login, password) {
        return db.getUser(login).then(function(user) {
            if (user) {
                if (user.password === password) {
                    return user;
                } else {
                    throw new Error('Wrong password', { statusCode: 403 });
                }
            } else {
                throw new Error('No user in db', { statusCode: 303 });
            }
        });
    },
    signin: function(login, password){
        return db.getUser(login).then(function(user) {
            if(!user){
                return db.saveUser(login, password);
            } else {
                throw new Erro('This user exist in db');
            }
        });
    },
    banAccount: function(user){
        return db.getUser(login).then(function(user) {
            if(user){
                if(user.group !== 'admin'){
                    return true;
                } else {
                    return false;
                }
            } else {
                throw new Erro('This user not exist in db');
            }
        });
    }

};
