
var app = angular.module('dollars');

app.service('ServiceMessages', ['socketio', '$rootScope', function( socketio, $rootScope ){

    var messages  = {};

    socketio.on('new:message', function(data){
            messages.push(data);
            $rootScope.$broadcast("new:message");
    });

    socketio.on('new:messages', function(data){
            messages = data; console.log(data);
            $rootScope.$broadcast("new:message");
    });

    this.sendMessage = function (message){
        socketio.emit('send:message', message);
    };

    this.getMessage = function() {
        return messages;
    };

    this.getMessages = function() {
        socketio.emit('get:messages');
    };

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

}]);
