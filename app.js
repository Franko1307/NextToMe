var express = require('express');  //
var session = require('express-session'); // Para manejar las sesiones
var flash      = require('connect-flash'); //
var bodyParser = require('body-parser'); //---
var mongoose   = require('mongoose');
var passport   = require('passport');
var configDB = require('./config/database.js');

var app = express();


var fs = require("fs");
var multer = require('multer');


mongoose.connect(configDB.url);
app.use(express.static(__dirname + '/public'))
var upload = multer({ dest: './uploads' });

var type = upload.single('recfile');

app.use(session({
  //store: new SessionStore({path: __dirname+'/tmp/sessions'}),
  secret: 'pingy burrtio taquito 123 no hackear pls arigato',
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.json())
app.use(bodyParser({uploadDir:'/public/tmp/img/'}));
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function() {
  console.log('we are connected');
});


require('./routes/principal.js')(app,passport,type,fs);
require('./config/passport')(passport);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
