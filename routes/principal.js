module.exports = function (app, passport) {
  app.get('/', function(req, res) {
		res.render('pages/index', {user: "Great User",title:"homepage"})
	})
  app.get('/login',function(req, res){
    if (req.isAuthenticated()) {
      res.redirect('/')
    }
    else {
      res.render('pages/login' ,{ message: req.flash('error') });
    }
  })
  app.get('/admin', isAuthenticated, function(req, res) {
    if ( ! req.user.hasAccess('admin') ) res.redirect('/login')

    var User       		= require('../models/user.js');

    User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });
    console.log(userMap);
    res.render('pages/admin', {users: userMap});
  });

  })
  app.post('/login', passport.authenticate('local-login', { failureRedirect: '/login' , failureFlash: true }), function(req, res) {
    if ( req.user.role === 'user' ) res.redirect('/user');
    if ( req.user.role === 'company' ) res.redirect('/company');
    if ( req.user.role === 'admin' ) res.redirect('/admin');
  });
  app.post('/user-sign-up', passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
  }));

  app.get('/*', function(app, res) {
    res.render('pages/index')
  })
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}
