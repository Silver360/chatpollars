

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', '$http', function( $scope, $state, $http ) {


    $scope.user = '';
    $scope.msg = '';

    var mojInterval = $interval(function () {

        getMsg();

    }, 1000);

    $scope.$on('$destroy', function () {
        $interval.cancel(mojInterval);
    });

    getMsg = function(){
        $http.get('http://localhost:8080/msg')
            .success(function (data, status) {
                this.msg = data;
            })
            .error(function (data) {
                console.log('ErrorLogin: ' + data);
            })
    }

}]);