

var app = angular.module('dollars');

app.factory('factoryAuthentication', ['socketio', '$state', '$location', function( socketio, $state, $location ){

    return {
        init: function() {
            socketio.emit('authentication', $location.path());
            socketio.on('access:denied', function (data) {
                $state.go('login');
            });
            socketio.on('access:go', function (data) {
                $state.go('chat');
            });
        }
    };

}]);
