var express = require('express');
var bodyParser  = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');


var app = express();

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'jade')

require('./routes/principal.js')(app)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
