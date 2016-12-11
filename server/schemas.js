var Sequelize = require('sequelize');
var database = new Sequelize('tubenotes', 'root', '');

// Define a user schema
var User = database.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

// Define a video schema
var Video = database.define('Video', {
  url: Sequelize.STRING,
  title: Sequelize.STRING
});

// Define a comment schema
var Comment = database.define('Comment', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  timestamp: Sequelize.INTEGER
});

// Create associations between users, comments, and videos
Comment.belongsTo(User);
Comment.belongsTo(Video);
Video.belongsTo(User);
User.hasMany(Comment);

// Create tables in mySQL if they don't exist
User.sync();
Video.sync();
Comment.sync();

exports.User = User;
exports.Video = Video;
exports.Comment = Comment;