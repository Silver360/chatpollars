

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', 'socketio', 'ServiceMessages', function( $scope, $state, socketio, ServiceMessages ) {


    $scope.user = '';
    $scope.msg = {};

    var Init = function(){

        ServiceMessages.getMessages();
    };

    $scope.sendMessage = function (message){
        ServiceMessages.sendMessage(message);
        $scope.message = '';
    };

    $scope.$on('new:message', function(){
        $scope.msg = ServiceMessages.getMessage();
    });

    Init();


}]);
