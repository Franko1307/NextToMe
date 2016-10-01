module.exports = function (app, passport) {
  app.get('/', function(req, res) {
    var obj = require("../public/assets/json/items.json");
    res.render('pages/index-directory', {user: req.user})
	})
  app.get('/sign-in',function(req, res){
    if (req.isAuthenticated()) {
      res.redirect('/')
    }
    else {
      res.render('pages/sign-in' ,{ errorMessage: req.flash('error'), user: null });
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
    res.render('pages/admin', {users: userMap});
  });

  })
  app.get('/submit', isAuthenticated, function(req,res) {
    res.render('pages/submit', {user: req.user});
  })
  app.get('/register', function(req,res) {
    if (req.isAuthenticated()) { res.redirect('/')}
    else { res.render('pages/register' ,{ errorMessage: req.flash('error') });}
  });
  app.get('/sign-out', function(req,res) {
    req.logout();
    res.redirect('/');
  })
  app.post('/sign-in', passport.authenticate('local-sign-in', { failureRedirect: '/sign-in' , failureFlash: true }), function(req, res) {
    if ( req.user.role === 'user' ) res.redirect('/user');
    if ( req.user.role === 'company' ) res.redirect('/company');
    if ( req.user.role === 'admin' ) res.redirect('/admin');
  });
  app.post('/register', passport.authenticate('local-register', { failureRedirect: '/register' , failureFlash: true }), function(req, res) {
    res.redirect('/')
  });
  app.post('/user-sign-up', passport.authenticate('local-sign-up-user', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

  app.get('/*', function(app, res) {
    res.render('pages/index')
  })
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/sign-in');
}
