angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory) {
  var intervalPromise;
  $scope.currentVideoTime = 0;

  window.onYouTubeIframeAPIReady = function() {
    window.player = new YT.Player('player', {
      width: '800',
      height: '450',
      videoId: $scope.getUrl(),
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
      $scope.currentVideoTime = Math.floor(player.getCurrentTime());
      // set interval for time setting
      intervalPromise = $interval(() => {$scope.currentVideoTime = 
                                         Math.floor(player.getCurrentTime());}
      , 100);
    } else if (event.data === YT.PlayerState.ENDED || 
       event.data === YT.PlayerState.PAUSED) {
      $interval.cancel(intervalPromise);
    }
  }

  $scope.postNote = function(title, note) {
    // post note to server
    var newNote = { user: username,
                    title: title,
                    note: note };
    AppFactory.addNote(newNote);
  }

  $scope.getUrl = function() {
    var currentVideoUrl = "htttps://www.youtube.com/embed/" + AppFactory.currentVideo.id;
    return $sce.trustAsResourceUrl(currentVideoUrl);
  }

  $scope.getVideoTime = function() {
    if (window.player){
      return window.player.getCurrentTime();
    } else {
      return 0;
    }
  }
});