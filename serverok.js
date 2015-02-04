var express=require('express');
var path = require('path');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser=require('body-parser');
//var validator=require('validator');
//var engines = require('consolidate');
///---------- login conection--------------
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
//var cors = require('cors');

//-----------
mongoose = require('mongoose');


//----estaticoo-----------

//
//app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
//------------------login------




// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.set("jsonp callback", true);
//
//

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret

app.use(flash()); // use connect-flash for flash messages stored in session
//-------------------
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));


routes = require('./server/routes/book')(app);
routes = require('./server/routes/user')(app);

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


function perimitirCrossDomain(req, res, next) {
  //en vez de * se puede definir SÓLO los orígenes que permitimos
  res.header('Access-Control-Allow-Origin', '*');
  //metodos http permitidos para CORS
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
 app.use(perimitirCrossDomain);






/*requestify.get('https://www.googleapis.com/books/v1/volumes?q=isbn:9788495733184')
  .then(function(response) {
      console.log(response);
      response.getBody();
  }
);*/

 








app.get('/', function(req, res){
 res.sendfile('public/index.html');
});

//------------socket.io-----------------


//-----------puertos
var port     = process.env.PORT || 8080; // set our port


  app.use(function( request, response ){
 
 
        // When dealing with CORS (Cross-Origin Resource Sharing)
        // requests, the client should pass-through its origin (the
        // requesting domain). We should either echo that or use *
        // if the origin was not passed.
        var origin = (request.headers.origin || "*");
 
 
        // Check to see if this is a security check by the browser to
        // test the availability of the API for the client. If the
        // method is OPTIONS, the browser is check to see to see what
        // HTTP methods (and properties) have been granted to the
        // client.
        if (request.method.toUpperCase() === "OPTIONS"){
 
 
            // Echo back the Origin (calling domain) so that the
            // client is granted access to make subsequent requests
            // to the API.
            response.writeHead(
                "204",
                "No Content",
                {
                    "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept",
                    "access-control-max-age": 10, // Seconds.
                    "content-length": 0
                }
            );
 
            // End the response - we're not sending back any content.
            return( response.end() );
 
 
        }
 
 
        // -------------------------------------------------- //
        // -------------------------------------------------- //
 
 
        // If we've gotten this far then the incoming request is for
        // our API. For this demo, we'll simply be grabbing the
        // request body and echoing it back to the client.
 
 
        // Create a variable to hold our incoming body. It may be
        // sent in chunks, so we'll need to build it up and then
        // use it once the request has been closed.
        var requestBodyBuffer = [];
 
        // Now, bind do the data chunks of the request. Since we are
        // in an event-loop (JavaScript), we can be confident that
        // none of these events have fired yet (??I think??).
        request.on(
            "data",
            function( chunk ){
 
                // Build up our buffer. This chunk of data has
                // already been decoded and turned into a string.
                requestBodyBuffer.push( chunk );
 
            }
        );
 
 
        // Once all of the request data has been posted to the
        // server, the request triggers an End event. At this point,
        // we'll know that our body buffer is full.
        request.on(
            "end",
            function(){
 
                // Flatten our body buffer to get the request content.
                var requestBody = requestBodyBuffer.join( "" );
 
                // Create a response body to echo back the incoming
                // request.
                var responseBody = (
                    "Thank You For The Cross-Domain AJAX Request:\n\n" +
                    "Method: " + request.method + "\n\n" +
                    requestBody
                );
 
                // Send the headers back. Notice that even though we
                // had our OPTIONS request at the top, we still need
                // echo back the ORIGIN in order for the request to
                // be processed on the client.
                response.writeHead(
                    "200",
                    "OK",
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                        "content-length": responseBody.length
                    }
                );
 
                // Close out the response.
                return( response.end( responseBody ) );
 
            }
        );
 
 
    }

 )



























http.listen(3000, function(){
 console.log('listening on *:3000');
});





module.exports = app;


