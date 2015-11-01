
var app = angular.module('dollars');

app.controller('preLogin', ['$scope', '$state', 'factoryAuthentication', function( $scope, $state, factoryAuthentication ) {

    $scope.appInit = function () {


    };

    $scope.testPass = function () {

        $scope.pass = null;

        $scope.enter = function () {

            if ($scope.pass == 'srallop') {
                $state.go('login');
            }
        }
    };

    $scope.appInit();

}]);