

var myApp = angular.module('dollars', [
    'ui.router',
]);

myApp.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $stateProvider
            .state('prelogin', {
                url: '/prelogin',
                templateUrl: 'views/prelogin.html',
                controller: 'ctrlPreLogin'
            })
            .state('CtrlLogin', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'ctrlLogin',
                resolve: {
                    authentication: function(factoryAuthentication){
                        console.log('Zaraz sprawdze i przekieruje z Login');
                        factoryAuthentication.init('CtrlLogin');
                    }
                }
            })
            .state('CtrlChat', {
                url: '/chat',
                templateUrl: 'views/chat.html',
                controller: 'ctrlChat',
                resolve: {
                    authentication: function(factoryAuthentication){
                        console.log('Zaraz sprawdze i przekieruje z Chat');
                        factoryAuthentication.init('CtrlChat');
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
