// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var http = require('http').Server(app);
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var io = require('socket.io')(http);

var configDB = require('./server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./server/config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


//app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovefastbookfastbookfastbook' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./server/routes/book.js')(app);
require('./server/routes/user.js')(app, passport); // load our routes and pass in our app and fully configured passport


//----------------------------------socket------------------------
//socket io
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);

  });
});
// log file ===============================================

// launch ======================================================================
/*app.listen(port);
console.log('The magic happens on port ' + port);*/

http.listen(port, function(){
  console.log('listening on *:' +port);
});


module.exports = app;
