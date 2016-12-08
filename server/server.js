var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');


var Sequelize = require('sequelize');

app.get('/videos', function (req, res) {
  // get all videos
  // get all comments
    // then send them back to the client
  res.send()
});

app.post('/comment', function (req, res) {
  // check it the request parameters are valid
  //write to db 
  res.send('Hello World!')
});

app.post('/video', function (req, res) {
  // check request if paramters are valid
  // write to db
  res.send('Hello World!')
});


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));