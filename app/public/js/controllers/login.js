

var app = angular.module('dollars');

app.controller('login', ['$scope', '$state', '$http', function( $scope, $state, $http ) {


    $scope.auth = {
        login: '',
        password: ''
    };

    $scope.msg = '';

    $scope.login = function(){
        $http.post('http://localhost:4040/login', $scope.auth)
            .success(function (data, status) {
                if(data == 'access')
                    $state.go('chat');
                else
                    this.msg = data;
            })
            .error(function (data) {
                console.log('ErrorLogin: ' + data);
            })
    }

}]);