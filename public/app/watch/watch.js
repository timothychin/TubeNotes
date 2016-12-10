angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory) {
  var intervalPromise;
  $scope.currentVideoTime = '00:00';
  $scope.videoComments = AppFactory.currentVideo.comments;

  window.onYouTubeIframeAPIReady = function() {
    // append youtube iframe to html element with id of 'player'
    window.player = new YT.Player('player', {
      width: '800',
      height: '450',
      videoId: AppFactory.currentVideo.id,
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
    $scope.currentVideo = AppFactory.currentVideo;
  }

  window.onPlayerStateChange = function(event) {
    // when video is playing, show the video's time 
    // on user's note taking window
    if (event.data === YT.PlayerState.PLAYING) {
      var seconds = Math.floor(player.getCurrentTime());
      // convert timestamp in seconds to a mm:ss string
      $scope.currentVideoTime = $scope.formatTime(seconds);
      // update time on interval of 100ms (not ideal performance)
      intervalPromise = $interval(() => 
        ($scope.currentVideoTime = 
            $scope.formatTime(Math.floor(player.getCurrentTime()))), 100);
    } else if (event.data === YT.PlayerState.ENDED || 
       event.data === YT.PlayerState.PAUSED) {
      // clear interval on video pause
      $interval.cancel(intervalPromise);
    }
  }

  $scope.formatTime = function(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;

    minutes = (minutes < 10) ? `0${minutes}`:`${minutes}`;
    seconds = (seconds < 10) ? `0${seconds}`:`${seconds}`;

    return `${minutes}:${seconds}`
  }

  $scope.postNote = function(title, note) {
    var timestamp = Math.floor(player.getCurrentTime());
    // add note to current video's comments array
    AppFactory.currentVideo.comments.push(
      { title: title,
        text: note,
        timestamp: timestamp });

    // update scope variable to make comments render on page
    $scope.videoComments = AppFactory.currentVideo.comments;

    // call update to server for the current video
    AppFactory.addNote(title, note, timestamp);
  }

  $scope.clickNote = function() {
    // when note is clicked
    // start playing video at note's timestamp
  }
});