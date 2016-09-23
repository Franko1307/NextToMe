
var LocalStrategy   = require('passport-local').Strategy;
var User       		= require('../models/user.js');
var bCrypt   = require('bcrypt-nodejs');

//Chequeo si la contra está chida

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
//Crea una contra chida
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

    // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'form-username',
      passwordField : 'form-password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form

      console.log(req.body);

      User.find({}, function(err, users) {
          var userMap = {};
          users.forEach(function(user) {
            console.log(user);
          });
        });
      console.log('-------------------');
      return done(null,false)
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'username' :  username }, function(err, user) {
          // if there are any errors, return the error before anything else
          console.log('despues');
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, { message: 'No user found' } );
          console.log(user);
          // if the user is found but the password is wrong
          if (!isValidPassword(user,password)) {
            console.log('justo antes');
            return done(null, false, { message: 'Invalid password' } );
          }


          // all is well, return successful user
          return done(null, user);
      });

  }));
  passport.use('local-sign-up-user', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'form-name',
      passwordField : 'form-password',
      passReqToCallback : true, // allows us to pass back the entire request to the callback
  },
  function(req, user, password, done) { // callback with email and password from our form

      console.log(req.body);

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email' :  req.body['form-email'] }, function(err, user) {
          // if there are any errors, return the error before anything else

          if (err)
              return done(err);

          if (user) {
              console.log('User already exists');
              return done(null, false, {msg: 'User already exists'} );
          } else {

              var n_user = new User();

              n_user.username = req.body['form-name'];
              n_user.password = createHash(req.body['form-password']);
              n_user.email    = req.body['form-email'];
              n_user.wea      = req.body['form-about-yourself'];
              n_user.role     = 'user';

              console.log(n_user);

            n_user.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
                console.log(n_user);
                return done(null, n_user, {msg: 'User registred'});
              });
            }
      });

  }));

}
