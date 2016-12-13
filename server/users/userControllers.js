var db = require('../schemas');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var cipher = Promise.promisify(bcrypt.hash);


// User authentication => jwt is stands for json web tokens. We used it in the angular sprint
module.exports = {
  signup: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOrCreate({where: {username: username, password: password}})
      .then(function (user) {
        //Once the user is created, send the client back a token 
        var token = jwt.encode(user, 'secret');        
        res.json({token: token})
      })
    // This method uses promises to store hashed passwords into the Database
    db.User.hook('beforeCreate', function (model, options) {      
      return cipher(model.get('password'), null, null).bind(model)
        .then(function(hash) {
          model.set('password', hash);
        });
    })
  },
  // This function is authenticating the password in the Database
  login: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // If the user doesn't exist send them back a friendly message,
    db.User.findOne({where: {username: req.body.username}})
      .then(function (user) {
        if (!user) {
          res.send('User does not exist!');
        } else {
        // If the current password matches, send them back a token
        var currentPassword = user.get('password');
          bcrypt.compare(password, currentPassword, function (err, isMatch) {
            if(isMatch) {
              var token = jwt.encode(user, 'secret');
              res.json({token: token});
            } else {
              res.send(500);
            }           
          })
        }
    })
    .catch(function () {
      res.send(500);
    })
  }
};