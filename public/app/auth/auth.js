angular.module('tubenotes.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (token) {
        window.username = $scope.user.username;        
        $window.localStorage.setItem('com.tubenotes', token);
        $location.path('/watch');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    window.username = $scope.user.username;
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.tubenotes', token);
        $location.path('/watch');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
