
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
		blackList: {
			data: {},
			searchBlackList: function(ip){
				if(this.data[ip] === undefined){
					return false;
				} else {
					return true;
				}
			},
			update: function(){
				return db.getBlackList().then(function(data){
					return module.exports.banAccount.blackList.data = data;
				});
			},
			getBlackList: function(){
				return this.data;
			},
			removeFromBlackList: function(loginUser){
				return db.removeFromBlackList(loginUser);
			}
		},
		ban: function(loginUser, req) {
			return db.getUser(loginUser).then(function(user) {
				if(req.request.session.user.group == 'admin'){	
					if(user){
						if(user.group !== 'admin'){
							return db.addToBlackList(loginUser, req.handshake.address);
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
		unBand: function(loginUser) {
			return this.blackList.update().then(function(data){
				for(var i in data) {
					console.log('i: ' + i + ' data: ', data );
					if (data.hasOwnProperty(i)) {
						if (data[i].login === loginUser) {
							module.exports.banAccount.blackList.removeFromBlackList(loginUser);
						} else{
							throw new Error('This user was not ban before', { statusCode: 403 });
						}
					}

				}
			});
		}

				
    }

};
