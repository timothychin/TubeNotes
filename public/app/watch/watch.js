angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce) {
  $scope.currentVideoTime = '';
  $scope.currentVideoUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/oTSGrL04wwU');

  $scope.postNote = function(title, note) {
    console.log('title is: ', title);
    console.log('note is: ', note);
    $scope.changeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
  }

  $scope.changeUrl = function(url) {
    $scope.currentVideoUrl = $sce.trustAsResourceUrl(url);
  }
});