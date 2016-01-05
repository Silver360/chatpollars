
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
                //audio1[0].play();
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
                e.preventDefault();
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


