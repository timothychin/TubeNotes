angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory) {
  var startTime = 0;
  var intervalPromise;
  $scope.currentVideoTime = '00:00';
  $scope.noteTimestamp = '';
  // scope variable for user note input
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

  $scope.setTimestamp = function() {
    // only set time stamp on user's first input
    if ($scope.userNote.note.$pristine) {
      startTime = Math.floor(player.getCurrentTime());   
      $scope.noteTimestamp = $scope.formatTime(startTime);   
    }
  }

  $scope.resetNote = function() {
    // empty input fields
    $scope.title = '';
    $scope.note = '';

    // reset $pristine flags on form
    $scope.userNote.title.$setPristine();
    $scope.userNote.note.$setPristine();

    // reset startTime and $scope.noteTimestamp to initial values
    startTime = 0;
    $scope.noteTimestamp = '';
  }

  $scope.postNote = function(title, note) {
    // var timestamp = Math.floor(player.getCurrentTime());
    console.log('comment timestamp is', startTime);
    // add note to current video's comments array
    AppFactory.currentVideo.comments.push(
      { title: title,
        text: note,
        timestamp: startTime });

    // update scope variable to make comments render on page
    $scope.videoComments = AppFactory.currentVideo.comments;

    // call update to server for the current video
    AppFactory.addNote(title, note, timestamp);
    var startTime = 0;
  }

  $scope.clickNote = function(comment) {
    // when note is clicked
    // start playing video at note's timestamp
    if (window.player) {
      window.player.seekTo(comment.timestamp, true);
    }
  }
});