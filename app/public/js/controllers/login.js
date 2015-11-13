

var app = angular.module('dollars');

app.controller('login', ['$scope', 'serviceLogin', 'factoryAuthentication',  function( $scope, serviceLogin, factoryAuthentication  ) {

    $scope.auth = {
        login: '',
        password: ''
    };

    $scope.msg = '';

    $scope.login = function(){
        serviceLogin.login($scope.auth);
    };

    $scope.$on('login:erorr', function(){
        $scope.msg = serviceLogin.getError();
    });

    $scope.confirm = function(){
        $scope.msg = '';
    }

}]);
