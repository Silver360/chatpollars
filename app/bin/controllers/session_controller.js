

module.exports = {

    verificationSession: function(req){
        console.log('Sprawdzam Sesje :) ================================');
        console.log(req.session);
        // if(req.session.user){
        //     console.log('Sesja Aktywna ================================');
        //     return 'access';
        // } else {
        //     if(req.path !== '/login') {
        //         req.session.status = "Odmowa dostepu!";
        //         return 'no-access';
        //     } else {
        //         return '';
        //     }
        // }
    },
    createSession: function(req, user, res){
        console.log('Tworze sesje ================================');
        //req.session.regenerate(function(){
            req.session.msg = 'jestem sobie w sesji';
            req.session.status = 'Uwierzytelniono jako ' + user.login;
            req.session.save()
            res.send('Sesja: ', req.session)
        //});
        console.log(req.session);
    },
    destroySesssion: function(req, res){
        req.session.destroy(function(){
            console.log('Wylogowany');
            res.redirect('/login');
        });
    }

};
