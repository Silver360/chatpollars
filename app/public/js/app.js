

var myApp = angular.module('dollars', [
    'ui.router',
]);

myApp.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $stateProvider
            .state('prelogin', {
                url: '/prelogin',
                templateUrl: 'views/prelogin.html',
                controller: 'preLogin'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'login',
                resolve: {
                    authentication: function(factoryAuthentication){
                        console.log('Zaraz sprawdze i przekieruje z Login');
                        factoryAuthentication.init('login');
                    }
                }
            })
            .state('chat', {
                url: '/chat',
                templateUrl: 'views/chat.html',
                controller: 'chat',
                resolve: {
                    authentication: function(factoryAuthentication){
                        console.log('Zaraz sprawdze i przekieruje z Chat');
                        factoryAuthentication.init('chat');
                    }
                }
            })
            .state('otherwise', {
                url: '*path',
                resolve: {
                    authentication: function(factoryAuthentication){
                        console.log('Zaraz sprawdze i przekieruje z Dowolnego');
                        factoryAuthentication.init('otherwise');
                    }
                }
            });

            $locationProvider.html5Mode(true);

    }
]);
