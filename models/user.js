'use strict';

var mongoose = require('mongoose');

var UserSchema = new require('mongoose').Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true},
  gender: {type: String, require: true},
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
