app.get('/', function(req, res) {
  res.render('index.ejs'); 
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
      user : req.user 
  });
});


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
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