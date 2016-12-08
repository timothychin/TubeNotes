var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var db = require('./schemas');

// api - require username
app.get('/videos', function (req, res) {
  //find userID from user
    // get all videos where video forieng key equals user id
    // get all comments
    // then send them back to the client
    
  res.send()
});

app.get('/test', function (req, res) {
  db.User.findOrCreate({where: {username: 'ANTON'}})
    .then(function (user) {
      // user[0].dataValues.id
      console.log(user[0].get('id'), 'userId');
      db.Video.findOrCreate({where: { url: 'youtube.com', title: 'CatVideo', UserId: user[0].get('id') }})
        .then(function (video) {
          db.Comment.findOrCreate({ where: { title: 'This is a comment title', text: 'comment text', UserId: user[0].get('id'), VideoId: video[0].get('id') }})
        })
  })

    res.send('sent');
});

app.get('/test-video', function () {
  db.Video.findOrCreate({where: {url: 'https://www.youtube.com/embed/4ZAEBxGipo', title: 'Superman', userId: 1}}).spread(function (user, created) {
    console.log(user.get({
      plain: true
    }))
    console.log(created);
  }) 
})


// from client 
  // username
  // videourl and video title
  // comment title, comment text, comment timestamp
  // find or create video given req.body.url and req.body.videoTitle
  // find or create comment given req.body.commentTitle, commentText, and commentTimestamp
  // then create associations

  // check it the request parameters are valid
  //write to db 
app.post('/comment-video', function (req, res) {
  //find or create username given req.body
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function (user) {
      db.Video.findOrCreate({where: { url: req.body.url, title: req.body.title, userId: user[0].get('id') }})
        .then(function (video) {
          db.Comment.findOrCreate({ where: { title: req.body.title, text: req.body.text, userId: user[0].get('id'), videoId: video[0].get('id') }})
        })
    })

  res.status(200).send('sent')
});





app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));