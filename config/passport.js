
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
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      console.log('antes');
      User.find({}, function(err, users) {
          var userMap = {};

          users.forEach(function(user) {
            console.log(user);
          });

        });

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

      /*
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      fullName: { type: String, required: true},
      gender: {type: String, require: true, num: ["Male", "Female"]},
      */
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
              console.log('Pronto te añadiré ');

              var user = new User();

              user.username = user;
              user.password = createHash(password);
              user.email = req.body['form-email'];
              user.wea = req.body['form-about-yourself'];
              user.role = 'user';

            user.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
                console.log(user);
                return done(null, user, {msg: 'User registred'});
              });
            }
      });

  }));

}
