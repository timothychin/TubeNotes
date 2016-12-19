angular.module('tubenotes.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth, AppFactory) {

  $scope.init = function() {
    vex.dialog.open({
      message: 'Log in with your username and password:',
      input: [
        '<input id="username" name="username" type="text" placeholder="Username" required />',
        '<input id="password" name="password" type="password" placeholder="Password" required />'
      ].join(''),
      buttons: [
        // modal box log in
        $.extend({}, vex.dialog.buttons.YES, { text: 'Login', click: function() {
          var combo = {username: document.getElementById('username').value, password: document.getElementById('password').value};
          var login = function (data) {
            if (!data) {
              console.log('Cancelled');
            } else {

              Auth.login(/*$scope.user*/ data)
              .then(function (token) {
                if (!token) {
                  $location.path('/login');
                } else {
                  // window.username = $scope.user.username;  
                  // console.log($scope.user.username)
                  AppFactory.username = /*$scope.user.username*/data.username;
                  // console.log('username: ', AppFactory.username);
                  $window.localStorage.setItem('com.tubenotes', token);
                  $location.path('/home');
                } 
              })
              .catch(function (error) {
                console.error(error);
              });
            }
          };
          login(combo);
        }}),
        $.extend({}, vex.dialog.buttons.NO, { text: 'Back' }),
        // modal box sign up
        $.extend({}, vex.dialog.buttons.YES, { text: 'Signup', click: function() {
          var combo = {username: document.getElementById('username').value, password: document.getElementById('password').value};
          signup = function (data) {
            Auth.signup(data)
            .then(function (token) {
              // Set the window username for sending data to the database
              // window.username = $scope.user.username;
              AppFactory.username = data.username;
              // console.log(AppFactory.username);
              $window.localStorage.setItem('com.tubenotes', token);
              $location.path('/home');
            })
            .catch(function (error) {
              console.error(error);
            });
          };
          signup(combo);
        }}),
      ],
    });
  };

});
