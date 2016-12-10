angular.module('tubenotes.search', [])

.controller('SearchController', function($scope, $http, AppFactory, $location) {
  $scope.message = 'SEARCH CONTROLLER';
  $scope.videos = [];
  $scope.userVideos = [];

  console.log('search controller is loaded');

  // This is to set the current video from the YouTube search
  $scope.setCurrentVideo = function (video) {
    AppFactory.currentVideo = {
      title: video.snippet.title,
      id: video.id.videoId
    };

    $location.path('/watch');
    // make asynchronous call to onYouTubeIframeAPIReady
    setTimeout(window.onYouTubeIframeAPIReady, 0);
  };

  // This is to set the current video to a video that you have already annotated
  $scope.setCurrentLibraryVideo = function (video) {
    AppFactory.currentLibraryVideo = {
      title: video.title,
      url: video.url,
      comments: video.comments
    };
    $location.path('/watch');
  };

  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  $http({
    method: 'GET',
    url: '/videos',
    params: {username: 'test'} // this will pass in the username to the request as request.query
  }).then(function(response) {
    // Store the results of the get request in $scope.userVideos
    $scope.userVideos = response.data;
    AppFactory.videoLibrary = response.data;
    console.log('videoLIbrary: ', AppFactory.videoLibrary);
  });

  $scope.searchYoutube = function(msg) {
    console.log('SEARCH YOUTUBE');

    $http.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: window.YOUTUBE_API_KEY,
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        q: msg
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