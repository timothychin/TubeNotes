var Q = require('q');
var db = require('../schemas');
var jwt = require('jwt-simple');


var findUser = Q.nbind(db.User.findOne, db.User);
var createUser = Q.nbind(db.User.create, db.User);


module.exports = {
  signup: function (req, res, next) {
  console.log('FINDING');    
    var username = req.body.username;
    var password = req.body.password;
    findUser({where: {username: username}})
      .then(function (user) {
        // the user doesn't exists, create the user
        if (user) {
          next(new Error('User already Exists!!'))
        } else {
          
          createUser({
            username: username,
            password: password
          })
        }
      })
      .then(function (user) {
        //create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (err) {
        next(err);
      })
  }
};



  // signup: function (req, res, next) {
  //   var username = req.body.username;
  //   var password = req.body.password;

  //   // check to see if user already exists
  //   findUser({username: username})
  //     .then(function (user) {
  //       if (user) {
  //         next(new Error('User already exist!'));
  //       } else {
  //         // make a new user if not one
  //         return createUser({
  //           username: username,
  //           password: password
  //         });
  //       }
  //     })
  //     .then(function (user) {
  //       // create token to send back for auth
  //       var token = jwt.encode(user, 'secret');
  //       res.json({token: token});
  //     })
  //     .fail(function (error) {
  //       next(error);
  //     });
  // },