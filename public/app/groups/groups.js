angular.module('tubenotes.groups', [])

.controller('GroupController', function($location, $scope, AppFactory, GroupHandler) {
  $scope.isLoggedIn = function() {
    if (AppFactory.username !== '') {
      return true;
    }
    return false;
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
    console.log('currentgroup is now', GroupHandler.currentGroup);
    $location.path('/groupVids');
  };

  var initializeGroups = function() {
    GroupHandler.getGroups()
    .then(function(data) {
      $scope.groups = data;
    });
  };

  initializeGroups();
});