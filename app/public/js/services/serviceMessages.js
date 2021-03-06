
var app = angular.module('dollars');

app.service('ServiceMessages', ['socketio', '$rootScope', function( socketio, $rootScope ){

    messages  = {};

    socketio.on('new:message', function(data){
            messages.push(data);
            $rootScope.$broadcast("new:message");
    });

    socketio.on('new:messages', function(data){
            messages = data;
            $rootScope.$broadcast("new:message");
    });

    this.sendMessage = function (message){
        socketio.emit('send:message', message);
    };

    this.getMessage = function() {
        return messages;
    };

    this.getMessages = function() { console.log('Hello');
        socketio.emit('get:messages', 'renio', function(data){
            messages = data;
            $rootScope.$broadcast("new:message");
        });
    };

    this.deleteMessage = function(user) {
        console.log('Message ============= ', findKey(messages, user));
        socketio.emit('delete:messages', findKey(messages, user), function(){

        });
    };

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function findKey(array, key){
        for(var i = 0; i < array.length; i++){
            if(array[i].indexOf(key) !== -1){
                return array[i];
            }
        }
    }

}]);
