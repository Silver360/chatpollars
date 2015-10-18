var express = require('express');
var app = express();
require('./bin/models/users.js');
require('./bin/models/messages.js');
var db = require('./bin/controllers/db_controller.js');


db.init(app);

require('./bin/routes.js').init(app);
app.listen(8080);

console.log('Nasluchuje na 8080');

