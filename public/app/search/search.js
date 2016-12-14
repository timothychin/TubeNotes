angular.module('tubenotes.search', [])

// AppFactory is from app.js to set the current video
.controller('SearchController', function($scope, $http, AppFactory, $location) {
  $scope.videos = AppFactory.searchResults;
});