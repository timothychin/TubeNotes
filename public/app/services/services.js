angular.module('tubenotes.services', [])

.factory('Auth', function ($http, $location, $window) {
  var username = '';
  var login = function (user) {
    console.log('clicked', user)
    return $http({
      method: 'POST',
      url: '/users/login',
      data: user
    })
    .then(function (resp) {
      console.log(resp.data, 'SERVICES 13')
      return resp;
    });
  };

  var signup = function (user) {
    console.log(user);
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      console.log(resp)
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.tubenotes');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.tubenotes');
    $location.path('/login');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    username: username
  };
});