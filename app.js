var express = require('express');
var expressSession = require('express-session');
var bodyParser  = require('body-parser')
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash')
var configDB = require('./config/database.js');

require('./config/passport')(passport);

mongoose.connect(configDB.url);


var app = express();

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSession({secret: ''}));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'jade')

require('./routes/principal.js')(app,passport)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
