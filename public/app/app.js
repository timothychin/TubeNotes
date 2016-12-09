angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'ngRoute'
])

.factory('AppFactory', function() {
  var addNote = function() {
    
  };
  var globalObj = {
    videoLibrary: [],
    currentVideo: {},
    currentLibraryVideo: {},
    addNote: addNote
  };

  return globalObj;
})

.controller('appController', function($scope) {
  $scope.currentVideo = "https://www.youtube.com/embed/4ZAEBxGipoA";
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/user/login.html',
      controller: ''
    })
    .when('/watch', {
      templateUrl: 'app/watch/watch.html',
      controller: 'WatchController'
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController'
    });
});