angular.module('tubenotes.search', [])

.controller('SearchController', function($scope, $http, test) {
  $scope.message = 'SEARCH CONTROLLER';
  $scope.videos = [];
  $scope.userVideos = [];

  console.log('search controller is loaded');
  console.log('TEST: ', test.value);

  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  $http({
    method: 'GET',
    url: '/videos',
    params: {username: 'test'} // this will pass in the username to the request as request.query
  }).then(function(response) {
    // Store the results of the get request in $scope.userVideos
    $scope.userVideos = response.data;
  });

  $scope.searchYoutube = function() {
    console.log('SEARCH YOUTUBE');
    var testSearch = 'cats';

    $http.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: window.YOUTUBE_API_KEY,
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        q: testSearch
      }
    })
    .success(function(data) {
      console.log('youtube get successful: ', data);
      $scope.videos = data.items;
      console.log('videos is now', $scope.videos);
    })
    .error(function() {
      console.log('ERROR');
    });
  };

  $scope.redirectToWatch = function(url) {
    console.log('URL', url);
    // Use $location.path('/watch')
    // Pass the url to compare against the db and load comments?
  };
});