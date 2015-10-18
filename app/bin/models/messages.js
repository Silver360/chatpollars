
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema =  new Schema({

    msg: String,
    timestamp: String,
    username: String

});

mongoose.model('Message', MessageSchema);