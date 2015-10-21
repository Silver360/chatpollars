
var db = require('./db_controller.js');
var Promise = require('bluebird');

module.exports = {

    shortId: require('shortid'),
    messages: {},
    msg: {},
    getMessages: function(){
        return this.messages;
    },
    createMsg: function(msg) {
        this.msg = {
            id: this.shortId.generate(),
            user: 'Renio',
            message: msg,
            timestamp: new Date()
        }
        this.messages[this.msg.id] = this.msg;
        return this.msg;
    }
};
