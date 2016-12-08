var Sequelize = require('sequelize');
var database = new Sequelize('tubenotes');

// Define a user schema
var User = database.define('User', {
  username: Sequelize.STRING
});

// Define a video schema
var Video = database.define('Video', {
  url: Sequelize.STRING
});

// Define a comment schema
var Comment = database.define('Comment', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  timestamp: Sequelize.STRING
});

// Create associations between users, comments, and videos
User.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Video);
VIdeo.belongsTo(User);

// Create tables in mySQL if they don't exist
User.sync();
Video.sync();
Comment.sync();

exports.User = User;
exports.Video = Video;
exports.Comment = Comment;