angular.module('tubenotes.groupVids', [])

.controller('GroupVidsController', function($location, $scope, GroupHandler, AppFactory) {
  $scope.groupname = GroupHandler.currentGroup.groupname;
  $scope.isLoggedIn = function() {
    if (AppFactory.username !== '') {
      return true;
    }
    return false;
  };

  $scope.joinGroup = function() {
    GroupHandler.joinGroup(GroupHandler.currentGroup.id);
  };

});