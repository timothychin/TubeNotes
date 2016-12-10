angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'ngRoute'
])

.factory('AppFactory', function($http) {
  
  var globalObj = {
    videoLibrary: [],
    currentVideo: {},
    currentLibraryVideo: {},
    addNote: addNote
  };

  var addNote = function(commentTitle, commentText) {
    note = {
      username: 'Dummy',
      videoUrl: 'youtube.com/embed/' + globalObj.currentVideo.id,
      videoTitle: globalObj.currentVideo.title,
      commentTitle: commentTitle,
      commentText: commentText
    };

    $http.post('/comment-video', note);
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