
var app = angular.module('dollars');

app.service('serviceLogin', ['socketio', '$rootScope', '$state', function( socketio, $rootScope, $state ){

    var error = {};

    socketio.on('login:res', function(data){
        if(data == 'access')
            $state.go('chat');
        else {
            error = data;
            $rootScope.$broadcast("login:erorr");
        }
    });

    this.login = function (auth){
        socketio.emit('login', auth);
    };

    this.getError = function(){
        return error;
    };

    this.signin = function(auth){
        socketio.emit('signin', auth);
    };


}]);
