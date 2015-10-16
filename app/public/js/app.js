

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
