const express = require('express');
const jwt = require('jwt-simple');
const userControllers = require('./users/userControllers.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pass = require('./passport.js');

const app = express();

// Middleware
const path = require('path');
const bodyParser = require('body-parser');
const stormpath = require('express-stormpath');

// Import the three collections from schemas
const db = require('./schemas');
const Sequelize = require('sequelize');

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// app.use(stormpath.init(app, {
//   website: true
// }));


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));

// Google Auth
// app.get('/', function(req, res) {
//   res.render('index.ejs'); 
// });

// app.get('/profile', isLoggedIn, function(req, res) {
//   res.render('profile.ejs', {
//       user : req.user 
//   });
// });


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }));
// app.get('/auth/google',
//   passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' });

// the callback after google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
          successRedirect : '/profile',
          failureRedirect : '/'
}));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
// End of Google Auth


// This is the get request to get all the videos of a certain user, along with their comments
app.get('/videos', function (req, res) {
  // Username is passed in from the get request as req.query.username
  // Initialize a results array to send back to the client
  var results = [];
  // Find a user in the database based on their username
  db.User.findOne({where: {username: req.query.username}}).then(function (user) {
    // Find all the videos that the found user has written notes on
    db.Video.findAll({where: {userId: user.id}}).then(function (videos) {
      // Loop through every found video
      for (let i = 0; i < videos.length; i++) {
        // Find all the comments on that certain video
        db.Comment.findAll({where: {videoId: videos[i].get('id')}}).then(function (comments) {
          // Create a new video object that will be pushed into the results array
          var videoObject = {
            url: videos[i].url,
            title: videos[i].title,
            comments: comments,
            image: videos[i].image,
            createdAt: videos[i].createdAt
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
  console.log('post');
  // Find a user in the database based on the passed in username
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function(user) {
      // Create a new video to post to the database linked to that user
      db.Video.findOrCreate({where: {
        url: req.body.videoUrl,
        UserId: user[0].get('id'),
        title: req.body.videoTitle,
        image: req.body.image
      }})
      .then(function (video) {
        // Create a new note to post to the database linked to that user and video
        // video[0].updateAttributes();
        db.Comment.create({text: req.body.commentText, timestamp: req.body.timestamp, UserId: user[0].get('id'), VideoId: video[0].get('id') });
      });
    });
  res.status(201).send('sent');
});

// Look into the userContollers folder for the signup and login method
app.post('/users/signup', userControllers.signup);
app.post('/users/login', userControllers.login);

app.use(express.static(path.join(__dirname, '../public')));

// app.on('stormpath.ready', function() {

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
  
// })


