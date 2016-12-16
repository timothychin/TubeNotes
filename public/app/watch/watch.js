angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory, GroupHandler, $location) {
  var startTime = 0;
  var intervalPromise;
  $scope.currentVideoTime = '00:00';
  $scope.noteTimestamp = '';
  $scope.groupList = GroupHandler.groups;
  $scope.groupName = $location.search().group;
  $scope.videoComments = AppFactory.currentVideo.comments;

  $scope.inGroupMode = function() {
    return !!$scope.groupName;
  };

  var initializeGroupComments = function() {
    GroupHandler.getGroupComments(GroupHandler.currentGroup.id, AppFactory.currentVideo.videoTableId)
    .then(function(data) {
      AppFactory.currentVideo.comments = data;
      $scope.videoComments = AppFactory.currentVideo.comments;
    });
  };
  if ($scope.inGroupMode()) {  //if in group mode, grab group comments
    initializeGroupComments();
  }

  // nav bar
  var navOpen = false;
  $scope.openNav = function() {
    document.getElementById('mySidenav').style.width = '350px';
    // uncomment below line 'Bookmark' will be pushed to the left
    document.getElementById('main').style.left = '72%';
    // uncomment below line the page background will change
    // document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
  };

  $scope.closeNav = function() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.left= '83%';
    document.body.style.backgroundColor = 'white';
  };

  // toggle the side bar
  $scope.toggleNav = function() {
    if (!navOpen) {
      $scope.openNav();
      navOpen = true;
    } else {
      $scope.closeNav();
      navOpen = false;
    }
  };

  // delete a note on the page and call deleteNote in app.js to send delete request to server
  $scope.deleteNote = function(comment) {
    // delete the comment from the page, comment is the comment object
    AppFactory.currentVideo.comments.forEach(function(savedComment, index) {
      if (comment.timestamp === savedComment.timestamp) {
        AppFactory.currentVideo.comments.splice(index, 1);
      }
    });
    console.log('deleted comment, ', comment);
    if ($scope.inGroupMode()) {  //if in group mode, grab group comments
      (GroupHandler.deleteGroupComment(comment));
    } else {
      AppFactory.deleteNote(comment);
    }
  };


  window.onYouTubeIframeAPIReady = function() {
    // append youtube iframe to html element with id of 'player'
    window.player = new YT.Player('player', {
      width: '800',
      height: '450',
      videoId: AppFactory.currentVideo.id || 'uxpDa-c-4Mc',
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
    $scope.currentVideo = AppFactory.currentVideo;
  };

  $scope.activeInterval = true;
  $scope.pausedTime = null;

  window.onPlayerStateChange = function(event) {
    // when video is playing, show the video's time
    // on user's note taking window

    if (event.data === YT.PlayerState.PLAYING) {
      console.log('hit play!!!!');
      console.log('activeInterval: ', $scope.activeInterval);
      // if storage is empty, continue as usual
      // if storage is not empty, create a new storage and splice on pause/end
      if (storage.length > 0) {
        console.log(player.getCurrentTime());
        var startTime = player.getCurrentTime(); // units are in seconds
        var editStorage = [];
        var grabCanvasEdited = setInterval(function() {
          console.log('inside setInterval edited');
          editStorage.push(JSON.stringify(canvas.toDatalessJSON()));

          // exit out of set Interval
          if ($scope.activeInterval === false) {
            console.log('clear setInterval now');
            clearInterval(grabCanvasEdited);
            console.log('check paused time persists inside setInterval: ', $scope.pauseTime);
            $scope.activeInterval = true;
            // splice into original array
            // if my interval was 500ms, that's 500/1000 ms or 1/2. if my entire video is 30s, i'd have 60 elements in the array, or 30s / 1/2.
            // to convert the second into the index position, it's (#ofSeconds * 1000 ms / s ) / interval
            var editStartIndex = Math.floor(startTime * 1000 / interval);
            var editPauseIndex = Math.floor($scope.pauseTime * 1000 / interval);
            console.log('start edited Index: ', editStartIndex);
            console.log('pause edited Index: ', editPauseIndex);
            console.log('original storage: ', storage);
            console.log('edited storage', editStorage);
            storage = storage.slice(0, editStartIndex).concat(editStorage, storage.slice(editPauseIndex));
            // storage.splice(editStartIndex, editPauseIndex - editStartIndex + 1, editStorage)
          }
        }, interval);
        // }
      } else {
        var grabCanvasNew = setInterval(function() {
            console.log('inside setInterval');
            storage.push(JSON.stringify(canvas.toDatalessJSON()));
            if ($scope.activeInterval === false) {
              console.log('clear setInterval now');
              clearInterval(grabCanvasNew);
              $scope.activeInterval = true;
            }
          }, interval);
        }
      } // end if PLAYING

      // grab player.getcurrenttime() and convert to seconds, then convert to index

    //   var grabCanvasNew = setInterval(function() {
    //     console.log('inside setInterval');
    //     storage.push(JSON.stringify(canvas.toDatalessJSON()));
    //     if ($scope.activeInterval === false) {
    //       console.log('clear setInterval now');
    //       clearInterval(grabCanvasNew);
    //       $scope.activeInterval === true;
    //     }
    //   }, interval);
    // }
    if (event.data === YT.PlayerState.PAUSED) {
      console.log('paused');
      console.log('paused at time: ', player.getCurrentTime());
      $scope.pauseTime = player.getCurrentTime(); // units are in seconds
      $scope.activeInterval = false;
    }

    if (player) {
      if (event.data === YT.PlayerState.PLAYING) {
        console.log('interval: ', interval);
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
  };

  $scope.formatTime = function(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;

    minutes = (minutes < 10) ? `0${minutes}`:`${minutes}`;
    seconds = (seconds < 10) ? `0${seconds}`:`${seconds}`;

    return `${minutes}:${seconds}`;
  };

  $scope.setTimestamp = function() {
    // only set time stamp on user's first input
    if (player) {
      if ($scope.userNote.note.$pristine) {
        startTime = Math.floor(player.getCurrentTime());
        $scope.noteTimestamp = $scope.formatTime(startTime);
      }
    }
  };

  $scope.resetNote = function() {
    // empty input fields
    $scope.note = '';

    // reset $pristine flags on form
    $scope.userNote.note.$setPristine();

    // reset startTime and $scope.noteTimestamp to initial values
    startTime = 0;
    $scope.noteTimestamp = '';
  };

  $scope.postNote = function(note) {
    // add note to current video's comments array
    AppFactory.currentVideo.comments.push(
      { text: note,
        timestamp: startTime,
        username: AppFactory.username }
    );
     // update scope variable to make comments render on page
    $scope.videoComments = AppFactory.currentVideo.comments;
    // call update to server for the current video
    if ($scope.inGroupMode()) {
      GroupHandler.postGroupComment(GroupHandler.currentGroup.id, note, startTime);
    } else {
      AppFactory.addNote(note, startTime);
    }
    $scope.resetNote();
  };

  $scope.clickNote = function(comment) {
    // when note is clicked
    // start playing video at note's timestamp
    if (window.player) {
      window.player.seekTo(comment.timestamp, true);
    }
  };

  $scope.postGroupVid = function(groupname) {
    GroupHandler.postGroupVid(groupname, AppFactory.currentVideo)
    .then(function(data) {
      GroupHandler.transferGroupComments($scope.videoComments, data[0].GroupId);
    });
  };







   var _ = function(id){return document.getElementById(id)};

   var canvas = this.__canvas = new fabric.Canvas('c', {
     isDrawingMode: false
   });
   var storage = [];
   var interval = 1000;
  // Canvas overlay function, invoked at the end to render
  (function() {
     var _ = function(id) {return document.getElementById(id)};

     fabric.Object.prototype.transparentCorners = false;

     var drawingModeEl = _('drawing-mode'),
         drawingOptionsEl = _('drawing-mode-options'),
         drawingColorEl = _('drawing-color'),
         drawingLineWidthEl = _('drawing-line-width'),
         clearEl = _('clear-canvas'),
         saveEl = _('save-canvas'),
         replayEl = _('replay-canvas');

     clearEl.onclick = function() { canvas.clear() };

     // var grabCanvas = function() {

     //   storage.push(JSON.stringify(canvas.toDatalessJSON()));
     //   if (canvas.isDrawingMode) {
     //     setTimeout(function() {
     //       grabCanvas();
     //     }, interval)
     //   } else if (!canvas.isDrawingMode) {
     //     return;
     //   }
     // }


     drawingModeEl.onclick = function() {
       canvas.isDrawingMode = !canvas.isDrawingMode;
       if (canvas.isDrawingMode) {
         drawingModeEl.innerHTML = 'Cancel drawing mode';
         drawingOptionsEl.style.display = '';
         $('.canvas').css('z-index', '10');
         console.log('hit');
         // grabCanvas();
       }
       else {
         drawingModeEl.innerHTML = 'Enter drawing mode';
         drawingOptionsEl.style.display = 'none';
         $('.canvas').css('z-index', '-10');
       }
     };


     drawingColorEl.onchange = function() {
       canvas.freeDrawingBrush.color = this.value;
     };

     drawingLineWidthEl.onchange = function() {
       canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
       this.previousSibling.innerHTML = this.value;
     };

     saveEl.onclick = function() {
       // Save to database
       console.log(storage);
     };

    replayEl.onclick = function() {
      var i = 0;

      var replay = setInterval(function() {
        console.log('test');
        $('.canvas').css('z-index', '10');
        i++;
        canvas.loadFromDatalessJSON(`${storage[i]}`).renderAll();

        if (i === storage.length - 1) {
          clearInterval(replay);
        }
      // $('.canvas').css('z-index', '-10');
      }, interval);
    };

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadowBlur = 0;
    }
  })()

});



