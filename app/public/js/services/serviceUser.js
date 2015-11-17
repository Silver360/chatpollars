
var app = angular.module('dollars');

app.factory('factoryUser', function(){

    return {
        user: {},
        setUser: function(data){
            console.log('User: ', data);
        },
        getUser: function(){
            console.log('Uzytkownik: ', this.user)
            return user;
        }

    }

});
