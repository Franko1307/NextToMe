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
  console.log('conexión establecida');
});

var UserSchema = new require('mongoose').Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  items: { type: Object},
  phone: { type: String },
  mobile: { type: String},
  state: { type: String},
  city: { type: String},
  street: { type: String},
  zip: { type: String},
  additional: { type: String},
  words: { type: String},
  facebook: { type: String},
  twitter: { type: String},
  googlep: { type: String},
  linkedin: { type: String},
  profile_picture: { type: String},
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
        console.log('Removiendo');
      });
    });

});



var admin = new root();

admin.username = 'admin';
admin.password = createHash('password');
admin.email = 'example@gmail.com';
admin.role = 'admin';


admin.save(function (err, admin) {
  if (err) {
    return console.error(err);
  }
  else {
    console.log('Admin guardado');
  }
});
