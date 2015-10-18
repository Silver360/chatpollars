
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema =  new Schema({

    login: { type: String, unique: true },
    password: String,
    group: String

});

mongoose.model('User', UserSchema);