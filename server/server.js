var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var db = require('./schemas');

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// API - require username
app.get('/videos', function (req, res) {
  // req.query.username is passed in from the get request
  var results = [];
  db.User.findOne({where: {username: req.query.username}}).then(function (user) {
    db.Video.findAll({where: {userId: user.get('id')}}).then(function (videos) {
      for (let i = 0; i < videos.length; i++) {
        db.Comment.findAll({where: {videoId: videos[i].get('id')}}).then(function (comments) {
          var videoObject = {
            url: videos[i].url,
            title: videos[i].title,
            comments: comments
          };
          results.push(videoObject);
          if (i === videos.length - 1) {
            res.send(results);
          }
        });
      }
    });
  });
});

app.post('/comment-video', function (req, res) {
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function (user) {
      db.Video.findOrCreate({where: { url: req.body.videoUrl, title: req.body.videoTitle, UserId: user[0].get('id') }})
        .then(function (video) {
          db.Comment.findOrCreate({ where: { title: req.body.commentTitle, text: req.body.commentText, timestamp: req.body.timestamp, UserId: user[0].get('id'), VideoId: video[0].get('id') }});
        });
    });
  res.status(201).send('sent');
});

// app.post('/users/signup', function (req, res) {
//   db.User.create({
//     {where: {username: req.body.username}}
//   })
//   //send them back a response token
//   res.send();
// })

app.post('/users/login', function (req, res) {
  db.User.findOne({
    
  })
  //send them back a response token
  res.send();
})


app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

