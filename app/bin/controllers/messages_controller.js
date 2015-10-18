
var db = require('./db_controller.js');
var Promise = require('bluebird');

module.exports = {

    getMsg: function(res){

        db.getMsg()
            .then(function(msg){
                res.send(msg)
            })
            .catch(function(error){
                console.log(error);
            });
    }
};