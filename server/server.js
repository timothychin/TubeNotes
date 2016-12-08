var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var db = require('./schemas');

// API - require username
app.get('/videos', function (req, res) {
  var results = [];
  db.User.findOne({where: {username: req.body.username}}).then(function (user) {
    db.Video.findAll({where: {userId: user.get('id')}}).then(function (videos) {
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        db.Comment.findAll({where: {videoId: video.get('id')}}).then(function (comments) {
          var videoObject = {
            url: video.url,
            title: video.title,
            comments: comments
          };
          results.push(videoObject);
          if (i === videos.length) {
            res.status(200).send(results);
          }
        });
      }
    });
  });
});


app.post('/comment-video', function (req, res) {
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function (user) {
      db.Video.findOrCreate({where: { url: req.body.url, title: req.body.title, userId: user[0].get('id') }})
        .then(function (video) {
          db.Comment.findOrCreate({ where: { title: req.body.title, text: req.body.text, userId: user[0].get('id'), videoId: video[0].get('id') }});
        });
    });
  res.status(201).send('sent');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
