
var app = angular.module('dollars');

app.service('serviceLogin', ['socketio', '$rootScope', '$state', 'factoryUser', function( socketio, $rootScope, $state, factoryUser ){

    var error = {};

    this.login = function (auth){
        socketio.emit('login', auth, function(data){
            if(data.res == 'access'){
                factoryUser.setUser(data.user);
                $state.go('CtrlChat');
            }
            else {
                error = data;
                $rootScope.$broadcast("login:erorr");
            }
        });
    };

    this.getError = function(){
        return error;
    };

    this.signin = function(auth){
        socketio.emit('signin', auth, function(data){
            if(data.res == 'access'){ console.log('data: ', data);
                factoryUser.setUser(data.user);
                $state.go('CtrlChat');
            }
            else {
                error = data;
                $rootScope.$broadcast("login:erorr");
            }
        });
    };

}]);
