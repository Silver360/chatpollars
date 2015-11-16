
var Promise = require('bluebird');
var session = require('./session_controller.js');

module.exports = {

    shortId: require('shortid'),
    messages: [],
    msg: [],
    getMessages: function(){
        return this.messages;
    },
    createMsg: function(msg, req) {
        if(req.session.user){
            this.msg = [
                this.shortId.generate(),
                req.session.user.login,
                msg,
                new Date()
            ];

            this.messages.push(this.msg);
            return this.msg;
        } else {
            new Error('No user in session', { statusCode: 403 });
        }

    }
};
