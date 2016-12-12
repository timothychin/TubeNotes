var db = require('../schemas');
var jwt = require('jwt-simple');




module.exports = {
  signup: function (req, res, next) {
  console.log('FINDING');    
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOrCreate({where: {username: username}})
      .then(function (user) {
        console.log(user, 'is user created!')
        var token = jwt.encode(user, 'secret');        
        res.json({token: token})
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
  }
};



  