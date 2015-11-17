

var app = angular.module('dollars');

app.factory('factoryAuthentication', ['socketio', '$state', '$location', '$http', 'factoryUser', function( socketio, $state, $location, $http, factoryUser ){

    return {
        init: function(state) {
            $http.post('/authentication', { url: $location.url() })
                .success(function (data){
                    console.log('Autoryzacja');
                    if(data.res == 'access:denied'){
                        console.log('Url: ', $location.url());
                        if(state !== '/login') {
                            console.log('go to login');
                            $state.go('login');
                        }
                    } else if (data.res == 'access:go'){
                        if(state !==  'chat') {
                            console.log('go to chat', $location.url());
                            factoryUser.setUser(data.user);
                            $state.go('chat');
                        }
                    } else {
                        console.log('Wydarzylo sie cos nie spodziewanego ', data)
                    }
                })
                .error(function(err){
                    console.log('Error przy autoryzacji: '. err)
                });
        }
    };

}]);
