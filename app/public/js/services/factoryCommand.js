

var app = angular.module('dollars');

app.factory('factoryCommand', ['socketio', '$rootScope', function( socketio, $rootScope ){

    return {
        sendCommand: function(command){
            console.log('Comm: ', command);
            socketio.emit('send:command', command, function(data){ console.log('Callback!!', data);
                $rootScope.$broadcast("blackList", data);
            });
        }
    };

}]);
