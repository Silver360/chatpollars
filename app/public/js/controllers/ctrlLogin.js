

var app = angular.module('dollars');

app.controller('ctrlLogin', ['$scope', 'serviceLogin', 'factoryAuthentication', 'logErrors',  function($scope, serviceLogin, factoryAuthentication, logErrors  ) {

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
        serviceLogin.signin($scope.auth);
    };

    $scope.cancel = function(){
        $scope.msg = '';
        $scope.auth = { login: '', password: '' };
    }

}]);
