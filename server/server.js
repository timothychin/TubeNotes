var express = require('express');
var app = express();
var jwt = require('jwt-simple');
var userControllers = require('./users/userControllers.js');

var path = require('path');
var bodyParser = require('body-parser');

// Import the three collections from schemas
var db = require('./schemas');

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// This is the get request to get all the videos of a certain user, along with their comments
app.get('/videos', function (req, res) {
  // Username is passed in from the get request as req.query.username

  // Initialize a results array to send back to the client
  var results = [];

  // Find a user in the database based on their username
  db.User.findOne({where: {username: req.query.username}}).then(function (user) {
    // Find all the videos that the found user has written notes on
    db.Video.findAll({where: {userId: user.get('id')}}).then(function (videos) {
      // Loop through every found video
      for (let i = 0; i < videos.length; i++) {
        // Find all the comments on that certain video
        db.Comment.findAll({where: {videoId: videos[i].get('id')}}).then(function (comments) {
          // Create a new video object that will be pushed into the results array
          var videoObject = {
            url: videos[i].url,
            title: videos[i].title,
            comments: comments
          };
          results.push(videoObject);

          // When we get to the end of the videos array, send the results array back to the client
          // (for async reasons)
          if (i === videos.length - 1) {
            res.send(results);
          }
        });
      }
    });
  });
});

// This is the post request for when a user submits a note on a video
app.post('/comment-video', function (req, res) {
  // Find a user in the database based on the passed in username
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function (user) {
      // Create a new video to post to the database linked to that user
      db.Video.findOrCreate({where: { url: req.body.videoUrl, title: req.body.videoTitle, UserId: user[0].get('id') }})
        .then(function (video) {
          // Create a new note to post to the database linked to that user and video
          db.Comment.findOrCreate({ where: { title: req.body.commentTitle, text: req.body.commentText, timestamp: req.body.timestamp, UserId: user[0].get('id'), VideoId: video[0].get('id') }});
        });
    });
  res.status(201).send('sent');
});

// Look into the userContollers folder for the signup and login method
app.post('/users/signup', userControllers.signup);
app.post('/users/login', userControllers.login);

app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

