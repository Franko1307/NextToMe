'use strict';

var mongoose = require('mongoose');

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


module.exports = mongoose.model('User', UserSchema);
