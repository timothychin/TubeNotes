angular.module('tubenotes.home', [])

.controller('HomeController', function($http, $scope, AppFactory) {
  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  $scope.username = AppFactory.username;

  $scope.isLoggedIn = function() {
    if (AppFactory.username !== '') {
      return true;
    }
    return false;
  };

  $scope.userVideos = [];

  var initializeLibrary = function() {
    return $http({
      method: 'GET',
      url: '/videos',
      params: {username: $scope.username} // this will pass in the username to the request as request.query
      // params: {username: window.username} // this will pass in the username to the request as request.query
    }).then(function(response) {
      // Store the results of the get request in $scope.userVideos
      $scope.userVideos = response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  initializeLibrary();
});