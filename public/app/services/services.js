angular.module('tubenotes.services', [])

// Factory for handling authentication 
.factory('Auth', function ($http, $location, $window) {
  var username = '';
  var login = function (user) {
    return $http({
      method: 'POST',
      url: '/users/login',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.tubenotes');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    username: username
  };
});