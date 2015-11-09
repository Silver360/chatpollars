
var app = angular.module('dollars');

app.service('serviceLogin', ['socketio', '$rootScope', '$state', '$http', function( socketio, $rootScope, $state, $http ){

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
        //socketio.emit('login', auth); console.log('AUtoryzacja: ', auth)
        $http.post('http://localhost:4040/login', auth)
            .then(function(result){
                console.log('Dane zwrocone przy prubie logowania ', result);
        }, function(err){
            console.log('Error przy probie logowania: ', err);
        });
    };

    this.getError = function(){
        return error;
    };


}]);
