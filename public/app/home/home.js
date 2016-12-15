angular.module('tubenotes.home', [])

.controller('HomeController', function($http, $scope, AppFactory) {
  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  $scope.userVideos = [];
  var initializeLibrary = function() {
    console.log('initializing library');
    console.log(AppFactory.username);
    return $http({
      method: 'GET',
      url: '/videos',
      params: {username: AppFactory.username} // this will pass in the username to the request as request.query
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