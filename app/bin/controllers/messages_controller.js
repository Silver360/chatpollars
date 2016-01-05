
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
                new Date(),
                req.session.user.avatar.url,
                req.session.user.avatar.color
            ];

            this.messages.push(this.msg);
            return this.msg;
        } else {
            new Error('No user in session', { statusCode: 403 });
        }

    },
    deleteMessage: function(data, req){
        var nick = data[1],
            key = data[0],
            messages = this.messages;

        if(req.session.user.login === nick || req.session.user.group === 'admin'){
            console.log('Fist wall defens');
            for(var i = 0; i < messages.length; i++){
                if(key === messages[messages.length - 1][0] || req.session.user.group === 'admin'){
                    console.log('Second Wall Defense');
                    if(messages[i].indexOf(key) !== -1){
                        messages.splice(i, 1);
                        console.log('Wiadomosc usunieta bez powrotnie :(');
                    }
                }
            }
        } else {
            new Error('You have no permission for this', { statusCode: 403 });
        }
    }
};
