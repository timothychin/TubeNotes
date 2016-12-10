angular.module('tubenotes.search', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.login = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.tubenotes',token);
        $location.path('/search')
      })
      .catch(function (error) {
        console.error(error);
      })
  }
  $scope.signup = function () {
    //write Auth.signup()
      //then
        //set item to local storage
      //catch errors
  }
})