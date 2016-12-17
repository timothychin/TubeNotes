angular.module('tubenotes.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth, AppFactory) {
  $scope.user = {};
  // $scope.login = function () {
  //   // If no token is sent back, the user is not authenticated
  //   Auth.login($scope.user)
  //     .then(function (token) {
  //       if (!token) {
  //         $location.path('/login');
  //       } else {
  //         // window.username = $scope.user.username;  
  //         // console.log($scope.user.username)
  //         AppFactory.username = $scope.user.username;
  //         console.log(AppFactory.username);
  //         $window.localStorage.setItem('com.tubenotes', token);
  //         $location.path('/home');
  //       } 
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  // modal box log in
  $scope.init = function() {
    // var cb;
    // var login = function (data) {
    //   if (!data) {
    //     console.log('Cancelled')
    //   } else {
    //     console.log('Username', data.username, 'Password', data.password);
    //     Auth.login(/*$scope.user*/ data)
    //     .then(function (token) {
    //       if (!token) {
    //         $location.path('/login');
    //       } else {
    //         // window.username = $scope.user.username;  
    //         // console.log($scope.user.username)
    //         AppFactory.username = /*$scope.user.username*/data.username;
    //         console.log('username: ', AppFactory.username);
    //         $window.localStorage.setItem('com.tubenotes', token);
    //         $location.path('/home');
    //       } 
    //     })
    //     .catch(function (error) {
    //       console.error(error);
    //     });
    //   }
    // }

    vex.dialog.open({
      message: 'Log in with your username and password:',
      input: [
        '<input name="username" type="text" placeholder="Username" required />',
        '<input name="password" type="password" placeholder="Password" required />'
      ].join(''),
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, { text: 'Login', click: function() {
          // cb = login;
          // console.log('cb', cb)
          console.log('login clicked');
        }}),
        $.extend({}, vex.dialog.buttons.NO, { text: 'Back' }),
        $.extend({}, vex.dialog.buttons.YES, { text: 'Signup', click: function() {
          console.log('signup clicked');
        }}),
      ],
      callback: function(data) {
        console.log('data,', data)
      }
    })
  }

  // modal box sign up
  // $scope.signuptest = function() {
    // vex.dialog.open({
    //   message: 'Log in with your username and password:',
    //   input: [
    //     '<input name="username" type="text" placeholder="Username" required />',
    //     '<input name="password" type="password" placeholder="Password" required />'
    //   ].join(''),
    //   buttons: [
    //     $.extend({}, vex.dialog.buttons.YES, { text: 'Login' }),
    //     $.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
    //   ],
    //   callback: function (data) {
    //     if (!data) {
    //       console.log('Cancelled')
    //     } else {
    //       console.log('Username', data.username, 'Password', data.password);
    //       Auth.login($scope.user data)
    //       .then(function (token) {
    //         if (!token) {
    //           $location.path('/login');
    //         } else {
    //           // window.username = $scope.user.username;  
    //           // console.log($scope.user.username)
    //           AppFactory.username = /*$scope.user.username*/data.username;
    //           console.log('username: ', AppFactory.username);
    //           $window.localStorage.setItem('com.tubenotes', token);
    //           $location.path('/home');
    //         } 
    //       })
    //       .catch(function (error) {
    //         console.error(error);
    //       });
    //     }
    //   }
    // })
  // }

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        // Set the window username for sending data to the database
        // window.username = $scope.user.username;
        AppFactory.username = $scope.user.username;
        console.log(AppFactory.username);
        $window.localStorage.setItem('com.tubenotes', token);
        $location.path('/home');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
