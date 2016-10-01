var mongoose = require('mongoose');

var bCrypt   = require('bcrypt-nodejs');

//Chequeo si la contra está chida

//Crea una contra chida
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


mongoose.connect('mongodb://localhost/nexttomedb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('SIIIIIIIII');
});

var UserSchema = new require('mongoose').Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

UserSchema.plugin(require('mongoose-role'), {
  roles: ['public', 'user', ,'company', 'admin'],
  accessLevels: {
    'public': ['public', 'user', 'admin'],
    'user': ['user', 'admin'],
    'company' : ['user','admin'],
    'admin': ['admin']
  }
});



var root = mongoose.model('User', UserSchema);

root.find({}, function(err, users) {
    users.forEach(function(user) {
      user.remove(function(err,removed) {
        console.log('removido nigga');
      });
    });

  });

var admin = new root();

admin.username = 'admin';
admin.password = createHash('PingyBurrito_903');
admin.email = 'franciscogonzalez1307@gmail.com';
admin.role = 'admin';

console.log(mongoose.models);

admin.save(function (err, admin) {
  if (err) {
    return console.error(err);
  }
  else {
    console.log('YEEI');
  }
});
