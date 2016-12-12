var db = require('../schemas');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var cipher = Promise.promisify(bcrypt.hash);



//jwt is stands for json web tokens. We used it in the angular sprint
module.exports = {
  signup: function (req, res, next) {
  console.log('FINDING');    
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

  login: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOne({where: {username: req.body.username}})
      .then(function (user) {
        if (!user) {
          res.send('User does not exist!');
        } else {
        var currentUser = user.get('username')
            // create token to send back for auth
        var token = jwt.encode(currentUser, 'secret');
        res.json({token: token});
      }      
    })
    .catch(function () {
      res.send(500);
    })
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(password) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash); //could be conflicting
      });
  }
};



  

// db.User.beforeCreate(function(user, options) {
//   return hashPassword(user.password).then(function (hashedPw) {
//     user.password = hashedPw;
//   });
// })

