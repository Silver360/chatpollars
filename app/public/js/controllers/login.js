

var myApp = angular.module('dollars', []);

myApp.controller('login', ['$scope', '$state', function( $scope, $state ) {


    $scope.appInit = function () {
        console.log('init');

    };


    $scope.appInit();


}]);