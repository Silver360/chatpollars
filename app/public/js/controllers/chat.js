

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', '$http', function( $scope, $state, $http ) {


    $scope.user = '';
    $scope.msg = {
      own: '',
      value: ''
    };

    var socket = io.connect();

    socket.on('message', function(data){
        $scope.msg.value += data + "<br/>";
    });

    $scope.sendMessage = function (){
        socket.emit('send message', this.msg.own);
        this.msg.own = '';
    };


}]);
