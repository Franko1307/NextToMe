var mongoose = require('mongoose');

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
  fullName: { type: String, required: true},
  gender: {type: String, require: true, num: ["Male", "Female"]},
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

var admin = new root();

admin.username = 'admin';
admin.password = 'PingyBurrito_903';
admin.email = 'franciscogonzalez1307@gmail.com';
admin.fullName = 'Francisco Enrique Córdova González';
admin.gender = 'Male';
admin.role = 'admin';

admin.save(function (err, admin) {
  if (err) {
    return console.error(err);
  }
  else {
    console.log('YEEI');
  }

});
