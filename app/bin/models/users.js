
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
 	UserSchema =  new Schema({
		login: { type: String, unique: true },
		password: String,
		group: String
	}),
	BlackList = new Schema({
		ip: { type: String, unique: true },	
		login: String,
		date: String,
	});

mongoose.model('User', UserSchema);
mongoose.model('BlackList', BlackList);