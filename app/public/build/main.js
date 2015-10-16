

var myApp = angular.module('dollars', [
    'ui.router',
    'login',
    'preLogin'
]);

myApp.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $stateProvider
            .state('prelogin', {
                url: '/prelogin',
                templateUrl: './views/prelogin.html',
                controller: 'preLogin'
            })
            .state('login', {
                url: '/login',
                templateUrl: './views/login.html',
                controller: 'login'
            });

        $urlRouterProvider.otherwise('/login')


    }
]);
;

var myApp = angular.module('dollars', []);

myApp.controller('login', ['$scope', '$state', function( $scope, $state ) {


    $scope.appInit = function () {
        console.log('init');

    };


    $scope.appInit();


}]);;
var myApp = angular.module('dollars', []);

myApp.controller('preLogin', ['$scope', '$state', function( $scope, $state ) {

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

}]);;

angular.module('dollars').directive('back', function ($state) {

    function link(scope, element, attrs) {

        element.find('.back').click(function(){

            stateChat();

        })

    }

    function stateChat() {
        $state.go('prelogin');
    }

    return{
        restrict: 'A',
        link: link
    }

});

angular.module('dollars').directive('validate', function () {

    function link(scope, element, attrs) {

        element.find('.button').click(function(){

            var audio1 = element.find('#main');
            var audio2 = element.find('#wrong');

            audio1[0].pause();
            audio2[0].play();

            audio2.bind('ended', function(){
                audio1[0].play();
            });

        })

    }

    return{
        restrict: 'A',
        link: link
    }

});