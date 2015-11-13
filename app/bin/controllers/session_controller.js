

module.exports = {

    verificationSession: function(req){
        console.log('Sprawdzam Sesje :)');
        if(req.session.user){
            console.log('Sesja Aktywna');
            return 'access';
        } else {
            if(req.path !== '/login') {
                req.session.error = "Odmowa dostepu!";
                return 'no-access';
            } else {
                return 'access-from-login';
            }
        }
    },
    createSession: function(req, user){
        console.log('Tworze sesje');
        req.session.user = user;
        req.session.succes = 'Uwierzytelniono jako ' + user.login;
        req.session.save();
    },
    destroySesssion: function(req, callback){
        req.session.destroy(function(){
            console.log('Wylogowany');
            callback();
        });
    }

};
