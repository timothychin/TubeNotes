angular.module('tubenotes.groupVids', [])

.controller('GroupVidsController', function($location, $scope, GroupHandler, AppFactory) {
  $scope.group = GroupHandler.currentGroup;
  $scope.groupVids = [];
  $scope.isLoggedIn = function() {
    return AppFactory.username !== '';
  };

  $scope.joinGroup = function() {
    GroupHandler.joinGroup(GroupHandler.currentGroup.id);
  };

  var initializeGroupVids = function() {
    GroupHandler.getGroupVids($scope.group.id)
    .then(function(videos) {
      GroupHandler.currentGroup.videos = videos;
      $scope.groupVids = GroupHandler.currentGroup.videos;
    }).catch(function(err) {
      console.log(err);
    });
  };
  initializeGroupVids();

  $scope.sortPropertyName = 'lastCommentDate';
  $scope.reverse = true;
  $scope.sortBy = function(sortPropertyName) {
    $scope.reverse = ($scope.sortPropertyName === sortPropertyName) ? !$scope.reverse : false;
    $scope.sortPropertyName = sortPropertyName;
  };
});