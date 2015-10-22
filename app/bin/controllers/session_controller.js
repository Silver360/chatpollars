

module.exports = {

    init: function(app){
    },
    verificationSession: function(req, res){
        console.log('Sprawdzam Sesje :)');
        if(req.session.user){
            console.log(req.session.sucess);
            console.log('Sesja Aktywna');
        } else {
            req.session.error = "Odmowa dostepu!";
            res.redirect('/login');
        }
    },
    createSession: function(req, res, user){
        req.session.regenerate(function(){
            req.session.user = user;
            req.session.succes = 'Uwierzytelniono jako ' + user.login;
        });
        res.redirect('/chat');
    },
    destroySesssion: function(req, res){
        req.session.destroy(function(){
            console.log('Wylogowany');
            res.redirect('/login');
        });
    }

};