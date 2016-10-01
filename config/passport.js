
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

  passport.use('local-sign-in', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'form-email',
      passwordField : 'form-password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form


      console.log('Voy a imprimir todos los users:');
      User.find({}, function(err, users) {
          users.forEach(function(user) {
            console.log(user);
          });
        });
      console.log('-------------------');

      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email' :  username }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, { message: 'El correo no está registrado' } );
          // if the user is found but the password is wrong
          if (!isValidPassword(user,password)) {
            return done(null, false, { message: 'La contraseña es incorrecta' } );
          }
          // all is well, return successful user          
          return done(null, user);
      });

  }));
  passport.use('local-register', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'form-name',
      passwordField : 'form-password',
      passReqToCallback : true, // allows us to pass back the entire request to the callback
  },
  function(req, user, password, done) { // callback with email and password from our form


      if ( req.body['form-password'] !== req.body['form-confirm-password'] )
        return done(null, false, { message : 'Error, las contraseñas no coinciden'});

      User.findOne({ 'email' :  req.body['form-email'] }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          if (user) {
              return done(null, false, { message : 'El correo ya está registrado'} );
          } else {

              var n_user = new User();

              n_user.username = req.body['form-name'];
              n_user.password = createHash(req.body['form-password']);
              n_user.email    = req.body['form-email'];
              n_user.role     = 'user';

              console.log(n_user);

            n_user.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
                console.log(n_user);
                return done(null, n_user);
              });
            }
      });

  }));

}
