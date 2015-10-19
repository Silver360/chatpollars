

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', 'socketio', function( $scope, $state, socketio ) {


    $scope.user = '';
    $scope.msg = {
      own: '',
      content: ''
    };

    $scope.message = '';


    socketio.on('new:message', function(data){
        console.log(data);
        $scope.msg.content += data + " ";
    });

    $scope.sendMessage = function (){
        socketio.emit('send:message', this.msg.own);
        $scope.msg.own = '';
    };


}]);
