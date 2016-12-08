angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce) {
  $scope.getUrl = function(){
    return $sce.trustAsResourceUrl("https://www.youtube.com/embed/4ZAEBxGipoA");
  }

  $scope.postNote = function(title, note) {
    console.log('title is: ', title);
    console.log('note is: ', note);
  }
});