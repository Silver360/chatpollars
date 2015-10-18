

var myApp = angular.module('dollars', [
    'ui.router'
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
                controller: 'login'
            })
            .state('chat', {
                url: '/chat',
                templateUrl: 'views/chat.html',
                controller: 'chat'
            });


        $urlRouterProvider.otherwise('/login')


    }
]);
;

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', '$http', function( $scope, $state, $http ) {


    $scope.user = '';
    $scope.msg = '';

    var mojInterval = $interval(function () {

        getMsg();

    }, 1000);

    $scope.$on('$destroy', function () {
        $interval.cancel(mojInterval);
    });

    getMsg = function(){
        $http.get('http://localhost:8080/msg')
            .success(function (data, status) {
                this.msg = data;
            })
            .error(function (data) {
                console.log('ErrorLogin: ' + data);
            })
    }

}]);;

var app = angular.module('dollars');

app.controller('login', ['$scope', '$state', '$http', function( $scope, $state, $http ) {


    $scope.auth = {
        login: '',
        password: ''
    };

    $scope.msg = '';

    $scope.login = function(){
        $http.post('http://localhost:8080/login', $scope.auth)
            .success(function (data, status) {
                if(data == 'access')
                    $state.go('chat');
                else
                    this.msg = data;
            })
            .error(function (data) {
                console.log('ErrorLogin: ' + data);
            })
    }

}]);;
var app = angular.module('dollars');

app.controller('preLogin', ['$scope', '$state', function( $scope, $state ) {

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
var app = angular.module('dollars')

app.directive('back', function ($state) {

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

app.directive('validate', function () {

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