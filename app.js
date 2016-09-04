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
app.use(flash());


app.use(expressSession({
  cookie : {
    maxAge: 3600000 // see below
  },
  secret: 'Habia una vez una galleta de melon que sabia a sandia',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

require('./routes/principal.js')(app,passport)

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
