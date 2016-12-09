angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory) {
  var interval;
  $scope.currentVideoTime = 0;

  // var player;
  window.onYouTubeIframeAPIReady = function() {
    window.player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      events: {
        // 'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  window.onPlayerStateChange = function(event) {
    // if video is playing, update 
    if (event.data === YT.PlayerState.PLAYING) {
      // set video to current time
      console.log('player.getCurrentTime() is', player.getCurrentTime());
      $scope.currentVideoTime = Math.floor(player.getCurrentTime());
      console.log('currentVideoTime is', $scope.currentVideoTime);
      // set interval for time setting
      interval = $interval(() => ($scope.currentVideoTime = Math.floor(player.getCurrentTime()))
      , 100);
    } else if (event.data === YT.PlayerState.ENDED || 
       event.data === YT.PlayerState.PAUSED) {

    }
  }

  $scope.postNote = function(title, note) {
    // $scope.changeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    console.log(Math.floor(window.player.getCurrentTime()));
  }

  $scope.getUrl = function() {
    var currentVideoUrl = "htttps://www.youtube.com/embed/" + AppFactory.currentVideo.id;
    return $sce.trustAsResourceUrl(currentVideoUrl);
    // $scope.currentVideoUrl = $sce.trustAsResourceUrl(url);
  }

  $scope.getVideoTime = function() {
    if (window.player){
      return window.player.getCurrentTime();
    } else {
      return 0;
    }
  }
});