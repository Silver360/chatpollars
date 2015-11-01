
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
                return db.saveUser(login, password);
            }
        });
    }
    
};