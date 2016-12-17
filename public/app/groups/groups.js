angular.module('tubenotes.groups', [])

.controller('GroupController', function($location, $scope, AppFactory, GroupHandler) {
  $scope.isLoggedIn = function() {
    return AppFactory.username !== '';
  };
  $scope.groupnameCreate = '';
  $scope.groupnameSearch = '';
  $scope.groups = [];

  $scope.searchGroups = function() {
  };

  $scope.createGroup = function(groupname) {
    GroupHandler.postGroup($scope.groupnameCreate);
  };

  $scope.setCurrentGroup = function(group) {
    GroupHandler.currentGroup = group;
    $location.path('/groupVids');
  };

  var initializeGroups = function() {
    GroupHandler.getGroups()
    .then(function(data) {
      GroupHandler.groups = data;
      $scope.groups = GroupHandler.groups;
    });
  };

  initializeGroups();
});