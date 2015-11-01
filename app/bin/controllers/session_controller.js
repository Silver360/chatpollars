

module.exports = {

    verificationSession: function(req){
        console.log('Sprawdzam Sesje :)');
        console.log(req.session);
        if(req.session.user){
            console.log('Sesja Aktywna');
            return 'access';
        } else {
            if(req.path !== '/login') {
                req.session.error = "Odmowa dostepu!";
                return 'no-access';
            } else {
                return '';
            }
        }
    },
    createSession: function(req, user){
        console.log('Tworze sesje');
        console.log(req.session);
        console.log(req.session.user);
        req.session.regenerate(function(){
            req.session.user = user;
            req.session.succes = 'Uwierzytelniono jako ' + user.login;
        });
    },
    destroySesssion: function(req, res){
        req.session.destroy(function(){
            console.log('Wylogowany');
            res.redirect('/login');
        });
    }

};