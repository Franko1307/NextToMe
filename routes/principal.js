module.exports = function (app, passport) {
  app.get('/', function(req, res) {
		res.render('index', {name:"Fran"})
	})
  app.get('/sign-up', function(app, res){
    res.render('sign_up')
  })
  app.post('/sign-up', passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
    failureFlash : true
  }));
  app.get('/*', function(app, res) {
    res.render('index')
  })
}
