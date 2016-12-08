angular.module('tubenotes.search', [])

.controller('SearchController', function($scope, $http) {
  $scope.message = 'SEARCH CONTROLLER';
  $scope.videos = [];

  console.log('search controller is loaded');

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
});