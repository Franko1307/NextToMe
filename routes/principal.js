module.exports = function (app, passport) {
  app.get('/', function(req, res) {
		res.render('pages/index', {user: "Great User",title:"homepage"})
	})
  app.get('/sign-up', function(app, res){
    res.render('pages/signup')
  })
  app.post('/sign-up', passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
    failureFlash : true
  }));
  app.get('/*', function(app, res) {
    res.render('pages/index')
  })
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
