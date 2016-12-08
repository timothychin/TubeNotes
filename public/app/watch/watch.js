angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce) {
  $scope.getUrl = function(){
    return $sce.trustAsResourceUrl("https://www.youtube.com/embed/4ZAEBxGipoA");
  }
});