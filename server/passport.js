const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// var routes = require('./routes.js')
var configAuth = require('./auth.js');
var User = require('./schemas.js');

module.exports = function() {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({

    clientID    : configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL

  }),
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

      // try to find the user based on their google id
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    });
  });
};