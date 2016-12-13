angular.module('tubenotes.search', [])

// AppFactory is from app.js to set the current video
.controller('SearchController', function($scope, $http, AppFactory, $location) {
  $scope.videos = [];
  $scope.userVideos = [];

  // This is to set the current video from the YouTube search and the library
    // 'video' comes from the youtube search and 'libVideo' comes from the users library of saved videos
  $scope.setCurrentVideo = function (video, libVideo) {
    if (video) {
      AppFactory.currentVideo = {
        title: video.snippet.title,
        id: video.id.videoId,
        comments: []
      };
    } else if (libVideo) {
      AppFactory.currentVideo = {
        title: libVideo.title,
        id: libVideo.url.slice(18),
        comments: libVideo.comments
      };
    }
    // Redirect the page to the watch route
    $location.path('/watch');
    // make asynchronous call to onYouTubeIframeAPIReady
    setTimeout(window.onYouTubeIframeAPIReady, 0);
  };
  // Every time search.html is loaded, do a get request to the server's /videos route
  // Make sure username is sent in the get request
  $http({
    method: 'GET',
    url: '/videos',
    params: {username: window.username} // this will pass in the username to the request as request.query
  }).then(function(response) {
    // Store the results of the get request in $scope.userVideos
    $scope.userVideos = response.data;
  });

  $scope.searchYoutube = function(msg) {
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
      $scope.videos = data.items;
    })
    .error(function() {
      console.log('ERROR');
    });
  };
});