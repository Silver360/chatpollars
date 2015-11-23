
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



}]);