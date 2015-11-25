
var app = angular.module('dollars');

app.filter('reverse', function() {
	return function(items) {
		if(Object.prototype.toString.call( items ) !== '[object Array]') return items;
		return items.slice().reverse();
	};
});