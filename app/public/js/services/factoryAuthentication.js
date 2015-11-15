

var app = angular.module('dollars');

app.factory('factoryAuthentication', ['socketio', '$state', '$location', '$http', function( socketio, $state, $location, $http ){

    return {
        init: function(state) {
            socketio.emit('authentication', $location.path());
            socketio.on('access:denied', function (data) {
                console.log('Url: ', $location.url());
                if(state !== '/login') {
                    console.log('go to login');
                    $state.go('login');
                }
            });
            socketio.on('access:go', function (data) {
                if(state !==  'chat') {
                    console.log('go to chat', $location.url());
                    $state.go('chat');
                }
            });
        }
        //init: function(state){
        //    $http.get('/authentication')
        //        .success(function (data){
        //            console.log('Auth: ', data);
        //            if(data === 'access:go'){
        //                if(state !== 'chat'){
        //                    console.log('go to chat', state);
        //                    $state.go('chat');
        //                }
        //            } else {
        //                console.log('Url: ', $location.url());
        //                if($location.url() !== '/login'){
        //                    console.log('go to login', $location.url());
        //                    $state.go('login');
        //                }
        //
        //            }
        //        })
        //        .error(function(err){
        //           console.log('Error przy sprawdzaniu autoryzacji: ', err);
        //        });
        //}
    };

}]);
