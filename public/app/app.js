angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'ngRoute'
])

.factory('AppFactory', function($http) {
  var addNote = function(note) {
    // note needs to be:
    // note = {
    //   username: '',
    //   videoUrl: '',
    //   videoTitle: '',
    //   commentTitle: '',
    //   commentText: ''
    // };

    $http.post('/comment-video', note);
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