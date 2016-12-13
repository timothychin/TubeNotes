angular.module('tubenotes.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.login = function () {
    // If no token is sent back, the user is not authenticated
    Auth.login($scope.user)
      .then(function (token) {
        if(!token) {
          $location.path('/login')
        } else {
          window.username = $scope.user.username;        
          $window.localStorage.setItem('com.tubenotes', token);
          $location.path('/watch');
        } 
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        // Set the window username for sending data to the database
        window.username = $scope.user.username;
        $window.localStorage.setItem('com.tubenotes', token);
        $location.path('/watch');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
