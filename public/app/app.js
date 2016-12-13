angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'tubenotes.services',
  'tubenotes.auth', 
  'ngRoute'
])

.factory('AppFactory', function($http) {
  
  // This factory function will do a post request to our server to store a note in our database
  var addNote = function(commentTitle, commentText, timestamp) {
    note = {
      username: window.username,
      videoUrl: 'youtube.com/embed/' + globalObj.currentVideo.id,
      videoTitle: globalObj.currentVideo.title,
      commentTitle: commentTitle,
      commentText: commentText,
      timestamp: timestamp
    };

    $http.post('/comment-video', note);
  };
  
  // This will be accessed in all of our controllers as AppFactory
  var globalObj = {
    currentVideo: {},
    addNote: addNote,
    username: ''
  };

  return globalObj;
})

.controller('appController', function($scope, $window, $location, AppFactory, Auth) {
  $scope.currentVideo = "https://www.youtube.com/embed/4ZAEBxGipoA";
  // Log the user out and reset the username to an empty street
  $scope.logout = function () {
    Auth.logout();
    window.username = '';
  };
})
// Routing for app
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth/login.html',
      controller: '',
    })
    .when('/watch', {
      templateUrl: 'app/watch/watch.html',
      controller: 'WatchController',
      authenticate: true
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      authenticate: true
    })   
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })    
    .when('/login', {
      templateUrl: 'app/auth/login.html',
      controller: 'AuthController'
    })
    .otherwise({
      redirectTo: '/login'
    });
  // We add our $httpInterceptor into the array
  // of interceptors. Think of it like middleware for your ajax calls
  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});