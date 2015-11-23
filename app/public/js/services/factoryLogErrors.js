
var app = angular.module('dollars');

app.service('logErrors', ['socketio', '$rootScope', '$state', function( socketio, $rootScope, $state ){

    var error = {};

    socketio.on('Error', function(data){
            error = data;
            $rootScope.$broadcast("Error");
    });

    this.getError = function(){
        return error;
    };

}]);
