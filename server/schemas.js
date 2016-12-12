// Sequelize is used as the ORM for mysql and tubenotes is the database
var Sequelize = require('sequelize');
// When starting on this project, create the database 'tubenotes' in mysql
var database = new Sequelize('tubenotes', 'root', '');

// Define a user schema
var User = database.define('User', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
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


