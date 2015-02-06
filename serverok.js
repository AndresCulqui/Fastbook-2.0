var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser');
var session      = require('express-session');

//----------------------------------

//--------------conexion a mongoosee---------
// Conexión
mongoose.connect('mongodb://localhost/books', function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log('Connected to Database Books');
  }
});







// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//
//

// required for passport
// required for passport
app.use(session({ 
    secret: 'ilovescotchscotchyscotchscotch',
    resave: true,
    saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session------
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, '/public')));


 routes=require('./server/routes/book')(app);
routes=require('./server/routes/user')(app,passport);

//---------------------------autenticacion para probar api n localhost
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE");
  return next();
});


//-------------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});


;

//------------socket.io-----------------


//-----------puertos
var port     = process.env.PORT || 8080; // set our port


 



























http.listen(3000, function(){
 console.log('listening on *:3000');
});





module.exports = app;


