
var db = require('./db_controller.js');
var Promise = require('bluebird');

module.exports = {

    shortId: require('shortid'),
    messages: [],
    msg: [],
    getMessages: function(){
        return this.messages;
    },
    createMsg: function(msg) {
        this.msg = [
            this.shortId.generate(),
            'Renio',
            msg,
            new Date()
        ];

        this.messages.push(this.msg);
        return this.msg;
    }
};
