angular.module('tubenotes.home', [])

.controller('HomeController', function($http, $scope) {
  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  // console.log(window.username);
  $http({
    method: 'GET',
    url: '/videos',
    params: {username: window.username} // this will pass in the username to the request as request.query
  }).then(function(response) {
    // Store the results of the get request in $scope.userVideos
    $scope.userVideos = response.data;
  });
});