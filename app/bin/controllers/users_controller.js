
var db = require('./db_controller.js');
var Promise = require('bluebird');

module.exports = {

	usersLive: {},
    login: function(login, password) {
        return db.getUser(login).then(function(user) {
            if (user) {
                if (user.password === password) {
                    return user;
                } else {
                    throw new Error('Wrong password', { statusCode: 401 });
                }
            } else {
                throw new Error('No user in db', { statusCode: 403 });
            }
        });
    },
    signin: function(login, password){
        return db.getUser(login).then(function(user) {
            if(!user){
                return db.saveUser(login, password);
            } else {
                throw new Error('This user exist in db', { statusCode: 403 });
            }
        });
    },
    banAccount: {
		blackList: {},
		ban: function(login, req) {
			return db.getUser(login).then(function(user) {
				if(req.request.session.user.group == 'admin'){	
					if(user){
						if(user.group !== 'admin'){
							return db.addToBlackList(login, req.handshake.address);
						} else {
							throw new Error('You can not ban your self or Admin user!! ', { statusCode: 404 });
						}
					} else {
						throw new Error('This user not exist in db', { statusCode: 404 });
					}
				} else {
					throw new Error('You have no privileges', { statusCode: 401 });
				}
			});
		},
		searchBlackList: function(ip){
			if(this.blackList[ip] === undefined){
				return false;
			} else {
				return this.blackList[ip];
			}
		}
				
    }

};
