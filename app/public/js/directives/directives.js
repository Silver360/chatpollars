

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