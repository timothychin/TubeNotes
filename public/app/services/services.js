angular.module('tubenotes.services', [])

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

  var logout = function () {
    $window.localStorage.removeItem('com.tubenotes');
    $location.path('/login');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    logout: logout,
    username: username
  };
});