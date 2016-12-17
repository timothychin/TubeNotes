angular.module('tubenotes.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth, AppFactory) {
// <<<<<<< 21e082b65311efc0360eaf922ad1f601c81a777e
  // old log in
  // $scope.user = {};
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
              console.log('Username', data.username, 'Password', data.password);
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
      // data will be the value of the input boxes
      // callback: function(data) {console.log('data,', data)}
    });
  };

//   // old sign up
//   // $scope.signup = function () {
//   //   Auth.signup($scope.user)
//   //     .then(function (token) {
//   //       // Set the window username for sending data to the database
//   //       // window.username = $scope.user.username;
//   //       AppFactory.username = $scope.user.username;
//   //       console.log(AppFactory.username);
//   //       $window.localStorage.setItem('com.tubenotes', token);
//   //       $location.path('/home');
//   //     })
//   //     .catch(function (error) {
//   //       console.error(error);
//   //     });
//   // };
// =======
//   $scope.user = {};
//   $scope.login = function () {
//     // If no token is sent back, the user is not authenticated
//     Auth.login($scope.user)
//       .then(function (token) {
//         if (!token) {
//           $location.path('/login');
//         } else {
//           // window.username = $scope.user.username;  
//           // console.log($scope.user.username)
//           AppFactory.username = $scope.user.username;
//           $window.localStorage.setItem('com.tubenotes', token);
//           $location.path('/home');
//         } 
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
//   };

//   $scope.signup = function () {
//     Auth.signup($scope.user)
//       .then(function (token) {
//         // Set the window username for sending data to the database
//         // window.username = $scope.user.username;
//         AppFactory.username = $scope.user.username;
//         $window.localStorage.setItem('com.tubenotes', token);
//         $location.path('/home');
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
//   };
// >>>>>>> Allow users to post videos to their groups and see videos in their group
});
