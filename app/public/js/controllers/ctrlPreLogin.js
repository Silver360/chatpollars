
var app = angular.module('dollars');

app.controller('ctrlPreLogin', ['$scope', '$state', 'serviceLogin', function($scope, $state, serviceLogin ) {

    $scope.testPass = function () {

        $scope.pass = null;

        $scope.enter = function () {
            serviceLogin.login($scope.pass);
        }
    };


}]);