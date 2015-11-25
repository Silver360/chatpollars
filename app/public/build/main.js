

var myApp = angular.module('dollars', [
    'ui.router',
	'ngAnimate'
])

.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
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
])

.animation('.ngAnimate', function(){
	return {
		enter: function(element, done){ console.log('Element: ', element);
			element.find('.right').css({
				opacity: 0
			})
			.animate({
				opacity: 1
			}, 2000, done);
		}
	};
});
;
var app = angular.module('dollars');

app.controller('ctrlChat', ['$scope', '$state', 'ServiceMessages', 'factoryUser', function($scope, $state, ServiceMessages, factoryUser ) {

    $scope.user = factoryUser.getUser();
    $scope.msg = {};

    var Init = function(){
        ServiceMessages.getMessages();
    };

    $scope.sendMessage = function(message){
        ServiceMessages.sendMessage(message);
        $scope.message = null;
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

app.controller('ctrlLogin', ['$scope', 'serviceLogin', 'factoryAuthentication',  function($scope, serviceLogin, factoryAuthentication  ) {

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
    };

}]);
;
var app = angular.module('dollars');

app.controller('ctrlPreLogin', ['$scope', '$state', 'factoryAuthentication', function($scope, $state, factoryAuthentication ) {

    $scope.appInit = function () {


    };

    $scope.testPass = function () {

        $scope.pass = null;

        $scope.enter = function () {

            if ($scope.pass == 'srallop') {
                $state.go('CtrlLogin');
            }
        }
    };

    $scope.appInit();

}]);;
var app = angular.module('dollars');

app.controller('ctrlTerminal', ['$scope', '$state', 'logErrors', 'factoryCommand', function( $scope, $state, logErrors, factoryCommand ) {

    $scope.command = '';
    $scope.output = 'Jeśli chesz, otrzymać informacje o dostepnych komendach. Wpisz help';

    $scope.sendCommand = function(){
        factoryCommand.sendCommand($scope.command);
        this.command = null;
    };

    $scope.$on('Error', function(){
        $scope.output = logErrors.getError();
    });

    $scope.$on('blackList', function(data){ console.log(data);
        for(var i in data){
            $scope.output += '<br>' + data[i].login;
        }
    });



}]);;
var app = angular.module('dollars');

app.directive('back', function ($state) {

    function link(scope, element, attrs) {

        element.find('.back').click(function(){

            stateChat();

        });

    }

    function stateChat() {
        $state.go('prelogin');
    }

    return{
        restrict: 'A',
        link: link
    };

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

        });

    }

    return{
        restrict: 'A',
        link: link
    };

});

app.directive('enterSend', function () {

    function link(scope, element, attrs) {
		
		element.keypress(function(e){
			if(e.which === 13 & event.shiftKey){
				return element;
			}
			if(e.which === 13){
				scope.$apply(function (){
					scope.$eval(attrs.enterSend);
				});
			}
		});

    }

    return{
        restrict: 'A',
        link: link
    };

});

app.directive('focus', function () {

    function link(scope, element, attrs) {
		element.click(function(){
			console.log('focus ^ ^');
			element.find('input').focus();
		});
		

    }

    return{
        restrict: 'A',
        link: link
    };

});
;
var app = angular.module('dollars');

app.filter('reverse', function() {
	return function(items) {
		if(Object.prototype.toString.call( items ) !== '[object Array]') return items;
		return items.slice().reverse();
	};
});;

var app = angular.module('dollars');

app.factory('factoryAuthentication', ['socketio', '$state', '$location', '$http', 'factoryUser', function( socketio, $state, $location, $http, factoryUser ){

    return {
        init: function(state) {
            $http.post('/authentication', { url: $location.url() })
                .success(function (data){
                    console.log('Autoryzacja', data.res);
                    if(data.res == 'access:denied'){
                        console.log('Url: ', $location.url());
                        if(state !== '/login') {
                            console.log('go to login');
                            $state.go('CtrlLogin');
                        }
                    } else if (data.res == 'access:go'){
                        if(state !==  'CtrlChat') {
                            console.log('go to chat', $location.url());
                            factoryUser.setUser(data.user);
                            $state.go('CtrlChat');
                        } else {
							factoryUser.setUser(data.user);
						}
                    } else {
                        console.log('Wydarzylo sie cos nie spodziewanego ', data);
                    }
                })
                .error(function(err){
                    console.log('Error przy autoryzacji: '. err);
                });
        }
    };

}]);
;

var app = angular.module('dollars');

app.factory('factoryCommand', ['socketio', '$rootScope', function( socketio, $rootScope ){

    return {
        sendCommand: function(command){
            console.log('Comm: ', command);
            socketio.emit('send:command', command, function(data){ console.log('Callback!!', data);
                $rootScope.$broadcast("blackList", data);
            });
        }
    };

}]);
;
var app = angular.module('dollars');

app.service('logErrors', ['socketio', '$rootScope', '$state', function( socketio, $rootScope, $state ){

    var error = {};

    socketio.on('Error', function(data){
            error = data;
            $rootScope.$broadcast("Error");
    });

    this.getError = function(){
        return error;
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

app.service('serviceLogin', ['socketio', '$rootScope', '$state', 'factoryUser', function( socketio, $rootScope, $state, factoryUser ){

    var error = {};

    socketio.on('login:res', function(data){
        if(data.res == 'access'){
			factoryUser.setUser(data.user);
            $state.go('CtrlChat');
		}
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
