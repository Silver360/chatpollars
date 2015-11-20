

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
;

var app = angular.module('dollars');

app.controller('chat', ['$scope', '$state', 'ServiceMessages', 'factoryUser', function( $scope, $state, ServiceMessages, factoryUser ) {

    $scope.user = '';
    $scope.msg = {};

    var Init = function(){

        ServiceMessages.getMessages();
    };

    $scope.sendMessage = function(message){
        ServiceMessages.sendMessage(message);
        $scope.message = '';
    };

    $scope.$on('new:message', function(){
        $scope.msg = ServiceMessages.getMessage();
    });

    $scope.deleteMessage = function(id){
        ServiceMessages.deleteMessage(id);
    };

    $scope.banUser = function(user){
        factoryUser.banUser(user);
    };

    Init();


}]);
;

var app = angular.module('dollars');

app.controller('login', ['$scope', 'serviceLogin', 'factoryAuthentication',  function( $scope, serviceLogin, factoryAuthentication  ) {

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
    }

}]);
;
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
;

var app = angular.module('dollars');

app.factory('factoryAuthentication', ['socketio', '$state', '$location', '$http', 'factoryUser', function( socketio, $state, $location, $http, factoryUser ){

    return {
        init: function(state) {
            $http.post('/authentication', { url: $location.url() })
                .success(function (data){
                    console.log('Autoryzacja');
                    if(data.res == 'access:denied'){
                        console.log('Url: ', $location.url());
                        if(state !== '/login') {
                            console.log('go to login');
                            $state.go('login');
                        }
                    } else if (data.res == 'access:go'){
                        if(state !==  'chat') {
                            console.log('go to chat', $location.url());
                            factoryUser.setUser(data.user);
                            $state.go('chat');
                        }
                    } else {
                        console.log('Wydarzylo sie cos nie spodziewanego ', data)
                    }
                })
                .error(function(err){
                    console.log('Error przy autoryzacji: '. err)
                });
        }
    };

}]);
;
var app = angular.module('dollars');

app.factory('socketio', function ($rootScope) {
    var socket = io.connect('http://localhost:4040');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
;/* global angular */

var app = angular.module('dollars');

app.factory('factoryUser', ['socketio', function(socketio){

    return {
        user: {},
        setUser: function(data){
            this.user = data;
        },
        getUser: function(){
            return this.user;
        },
        banUser: function(user){
            socketio.emit('ban:perma', user);
        }

    };

}]);
;
var app = angular.module('dollars');

app.service('serviceLogin', ['socketio', '$rootScope', '$state', function( socketio, $rootScope, $state ){

    var error = {};

    socketio.on('login:res', function(data){
        if(data == 'access')
            $state.go('chat');
        else {
            error = data;
            $rootScope.$broadcast("login:erorr");
        }
    });

    this.login = function (auth){
        socketio.emit('login', auth);
    };

    this.getError = function(){
        return error;
    };

    this.signin = function(auth){
        socketio.emit('signin', auth);
    };


}]);
;
var app = angular.module('dollars');

app.service('ServiceMessages', ['socketio', '$rootScope', function( socketio, $rootScope ){

    messages  = {};

    socketio.on('new:message', function(data){
            messages.push(data);
            $rootScope.$broadcast("new:message");
    });

    socketio.on('new:messages', function(data){
            messages = data;
            $rootScope.$broadcast("new:message");
    });

    this.sendMessage = function (message){
        socketio.emit('send:message', message);
    };

    this.getMessage = function() {
        return messages;
    };

    this.getMessages = function() {
        socketio.emit('get:messages');
    };

    this.deleteMessage = function(user) {
        console.log('Message ============= ', findKey(messages, user));
        socketio.emit('delete:messages', findKey(messages, user), function(){

        });
    }

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function findKey(array, key){
        for(var i = 0; i < array.length; i++){
            if(array[i].indexOf(key) !== -1){
                return array[i];
            }
        }
    }

}]);
