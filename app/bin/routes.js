
var express = require('express');

module.exports = function(app){

    app.use( '/', express.static('./public') );

    //app.get('/login', function(req, res){
    //    res.redirect('/views/login.html');
    //});


};