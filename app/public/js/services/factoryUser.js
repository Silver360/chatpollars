
var app = angular.module('dollars');

app.factory('factoryUser', ['socketio', function(socketio){

    return {
        user: {},
        setUser: function(data){
            this.user = data;
        },
        getUser: function(){
            return user;
        },
        banUser: function(user){
            socketio.emit('ban:perma', user);
        }

    }

}]);
