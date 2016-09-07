var express = require('express');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash')
var configDB = require('./config/database.js');


var app = express(); //Express

var bodyParser = require( 'body-parser' ); //problema nlcs con credenciales
app.use( bodyParser.urlencoded({ extended: true }) );

require('./config/passport')(passport);  //Métodos de validación de passport

mongoose.connect(configDB.url); //Conectamos a la base de datos

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});




app.use(express.static(__dirname + '/public')) //Hacemos estático la carpeta public

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.set('view engine', 'ejs');

app.use(expressSession({
  cookie : {
    maxAge: 3600000 // see below
  },
  secret: 'Habia una vez una galleta de melon que sabia a sandia',
  resave: true,
  saveUninitialized: true
}))

//rutas
require('./routes/principal.js')(app,passport)

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
