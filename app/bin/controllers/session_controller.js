

module.exports = {

    verificationSession: function(req){
        console.log('Sprawdzam Sesje :)');
        if(req.session.user){
            return true;
        } else {
            return false;
        }
    },
    createSession: function(req, user){
        console.log('Tworze sesje');
        req.session.user = user; console.log('User in Session: ', user);
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
