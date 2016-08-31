var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    }
});


module.exports = mongoose.model('User', userSchema);
