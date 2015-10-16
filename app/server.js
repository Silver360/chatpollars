
var express = require('express');
var app = express();
var bodyParser = require('body-parser');




require('./bin/routes.js')(app);
app.listen(8080);

console.log('Nasluchuje na 8080');

