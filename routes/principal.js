module.exports = function (app, passport, type, fs) {
  app.get('/', function(req, res) {

    var obj = require("../public/assets/json/items.json");
    res.render('pages/index-directory', {user: req.user, oferta: obj})
	})
  app.get('/sign-in',function(req, res){
    var obj = require("../public/assets/json/items.json");
    if (req.isAuthenticated()) {
      res.redirect('/')
    }
    else {
      res.render('pages/sign-in' ,{ errorMessage: req.flash('error'), user: null, oferta:obj });
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
    var obj = require("../public/assets/json/items.json");
    res.render('pages/submit', {user: req.user, oferta:obj});
  })
  app.get('/register', function(req,res) {
    if (req.isAuthenticated()) { res.redirect('/')}
    else {
      var obj = require("../public/assets/json/items.json");
      res.render('pages/register' ,{ errorMessage: req.flash('error'), user: null,oferta: obj});
    }
  });
  app.get('/sign-out', function(req,res) {
    req.logout();
    res.redirect('/');
  })
  app.get('/profile-:username' ,isAuthenticated,function(req,res) {
    res.render('pages/user' ,{ errorMessage: req.flash('error'), user: req.user, link: req.query });
  })
  app.get('/items-:username' ,isAuthenticated,function(req,res) {
    res.render('pages/myitems.ejs' ,{ errorMessage: req.flash('error'), user: req.user, link: req.query });
  })
  app.post('/submit', isAuthenticated ,type, function (req,res) {

    /** When using the "single"
        data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;
    var username = req.user.id;
    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var target_path = 'public/assets/img/users/' + username +'-'+ req.file.originalname;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);

    src.pipe(dest);

    var json = require("../public/assets/json/items.json");
    console.log('-------------------------------');
    console.log(req.body);

    var offer = {
      "id": json.data.length + 1,
      "category": "bar_restaurant",
      "title": req.body.title,
      "location": req.body.zip + " " + req.body.street,
      "latitude": req.body.lat,
      "longitude": req.body.lon,
      "url": "item-detail.html",
      "type": "Restaurant",
      "type_icon": "assets/icons/store/apparel/bags.png",
      "rating": 5,
      "price": req.body['menu-price'][0],
      "gallery": ["assets/img/users/"+username+"-"+req.file.originalname],
      "color": "",
      "item_specific":
          {
              "menu": "$6.50",
              "offer1": "Chicken wings",
              "offer1_price": "4.50",
              "offer2": "Mushroom ragout",
              "offer2_price": "3.60",
              "offer3": "Nice salad with tuna, beans and hard-boiled egg",
              "offer3_price": "1.20"
          },
      "oferta": {
        "titulo": req.body['menu-title'][0],
        "precio": req.body['menu-price'][0],
        "descripcion:": req.body['menu-description'][0],
      }
    }


    json['data'].push(offer);
    console.log(json);
    fs.writeFile('public/assets/json/items.json', JSON.stringify(json));

    console.log('mira mama por aqui sigo');
    res.redirect('/');

});
  app.post('/submit', isAuthenticated,  function(req,res){



  })
  app.post('/update-user', isAuthenticated, function(req,res){
    var User = require('../models/user.js');

    User.findOne({ email: req.user.email }, function (err, doc){
      doc.fullname     = req.body["form-account-name"]
      doc.phone        = req.body['form-account-phone']
      doc.mobile       = req.body['form-account-mobile']
      doc.state        = req.body['form-account-state']
      doc.city         = req.body['form-account-city']
      doc.street       = req.body['form-account-street']
      doc.zip          = req.body['form-account-zip']
      doc.additional   = req.body['form-account-add-address']
      doc.words        = req.body['form-contact-agent-message']
      doc.facebook     = req.body['account-social-facebook']
      doc.twitter      = req.body['account-social-twitter']
      doc.googlep      = req.body['account-social-googleplus']
      doc.linkedin     = req.body['account-social-linkedin']
      doc.save();
    });

    res.redirect('/');


  })
  app.post('/sign-in', passport.authenticate('local-sign-in', { failureRedirect: '/sign-in' , failureFlash: true }), function(req, res) {

    if ( req.user.role === 'user' ) res.redirect('/');
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
