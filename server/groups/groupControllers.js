var db = require('../schemas');

module.exports = {
  postGroup: function(req, res) {
    var groupname = req.body.groupname;
    db.Group.findOrCreate({where: {groupname: groupname}})
    .then(function(group) {
      res.status(201).send('successfully posted group');
    });
  },

  getGroups: function(req, res) {
    db.Group.findAll().then(function(groups) {
      res.status(200).send(JSON.stringify(groups));
    });
  },

  joinGroup: function(req, res) {
    db.User.findOne({where: {username: req.body.username}})
    .then(function(user) {
      if (!user) {
        res.send('User does not exist!');
      } else {
        var userid = user.get('id');
        db.GroupUser.findOrCreate({where: {
          UserId: userid, 
          GroupId: req.body.groupId
        }})
        .then(function(groupUser) {
          res.status(201).send('successfully joined group');
        });
      }
    });
  },
  postGroupVid: function(req, res) {

  },
  getGroupVids: function(req, res) {

  },
  getUserGroups: function(req, res) {
    // console.log(req.body.username)
    // db.User.findOne({where: {username: req.body.username}})
    // .then(function(user) {
    //   if (!user) {
    //     res.send('User does not exist!');
    //   } else {
    //     var userid = user.get('id');
    //     db.GroupUser.findAll({where: {
    //       UserId: userid
    //     }})
    //     .then(function(groups) {
    //       console.log(groups);
    //       res.status(200).send(JSON.stringify(groups));
    //     });
    //   }
    // });
  }
};