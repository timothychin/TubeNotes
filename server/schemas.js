// Sequelize is used as the ORM for mysql and tubenotes is the database
var Sequelize = require('sequelize');
// When starting on this project, create the database 'tubenotes' in mysql
var database = new Sequelize('tubenotes', 'root', '');

// Define a user schema
var User = database.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Define a video schema
var Video = database.define('Video', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  title: Sequelize.STRING, 
  image: Sequelize.STRING
});

// Define a comment schema
var Comment = database.define('Comment', {
  text: Sequelize.STRING,
  timestamp: Sequelize.INTEGER,
  group: Sequelize.BOOLEAN
});

var Group = database.define('Group', {
  groupname: Sequelize.STRING
});

var GroupUser = database.define('GroupUser', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

var GroupVideo = database.define('GroupVideo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

var GroupComment = database.define('GroupComment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

// Create associations between users, comments, and videos
Comment.belongsTo(User);
Comment.belongsTo(Video);
Video.belongsTo(User);
User.hasMany(Comment);
User.belongsToMany(Group, {through: 'GroupUser'});
Group.belongsToMany(User, {through: 'GroupUser'});

Video.belongsToMany(Group, {through: 'GroupVideo'});
Group.belongsToMany(Video, {through: 'GroupVideo'});

Comment.belongsToMany(Group, {through: 'GroupComment'});
Group.belongsToMany(Comment, {through: 'GroupComment'});

// Create tables in mySQL if they don't exist
User.sync();
Video.sync();
Comment.sync();
Group.sync();
GroupUser.sync();
GroupVideo.sync();
GroupComment.sync();

exports.User = User;
exports.Video = Video;
exports.Comment = Comment;
exports.Group = Group;
exports.GroupUser = GroupUser;
exports.GroupVideo = GroupVideo;
exports.GroupComment = GroupComment;


