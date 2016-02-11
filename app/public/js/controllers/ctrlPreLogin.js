
var app = angular.module('dollars');

app.controller('ctrlPreLogin', ['$scope', '$state', 'serviceLogin', function($scope, $state, serviceLogin ) {

	$scope.pass = null;

	$scope.enter = function () {
		serviceLogin.prelogin($scope.pass);
	};


}]);