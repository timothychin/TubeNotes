angular.module('tubenotes.groups', [])

.controller('GroupController', function($location, $scope, AppFactory, GroupHandler) {
  $scope.isLoggedIn = function() {
    return AppFactory.username !== '';
  };
  $scope.groupnameCreate = '';
  $scope.groupnameSearch = '';
  $scope.groups = [];

  $scope.searchGroups = function(groupname) {
    GroupHandler.searchGroups(groupname)
    .then(function(data) {
      if (typeof data === 'object') {
        $scope.groups = data; 
      } else {
        $scope.groups = null;
      }
    });
  };

  $scope.createGroup = function(groupname) {
    GroupHandler.postGroup($scope.groupnameCreate)
    .then(function(newGroup) {
      $scope.setCurrentGroup(newGroup[0]);
      GroupHandler.joinGroup(GroupHandler.currentGroup.id);
    });
  };

  $scope.setCurrentGroup = function(group) {
    GroupHandler.currentGroup = group;
    $location.path('/groupVids');
  };

  $scope.initializeGroups = function() {
    GroupHandler.getGroups()
    .then(function(data) {
      $scope.groups = data;
    });
  };

});