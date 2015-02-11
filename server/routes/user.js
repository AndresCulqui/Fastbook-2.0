module.exports = function(app, passport) {

	var jwt = require('jwt-simple'),
	   	formidable = require('formidable'),
    	util = require('util')
   		 fs   = require('fs-extra');

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('/');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		var tokenSecret="ilovefastbook";
		 var token = jwt.encode(req.user, tokenSecret);

		res.send( {
			user : req.user,
			token:token
		});

	});
  /*app.get('/', function(req, res) {
  res.sendfile("../../public/index.html#home");
});*/


	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
    
		
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================

	

		// process the login form
		app.post('/login', 
			passport.authenticate('local-login'),
				function(req,res){
					res.send(req.user);
				}
				);
		

		// SIGNUP =================================


		// process the signup form
		app.post('/signup', 
			passport.authenticate('local-signup'),
				function(req,res){
					res.send(req.user);
				}
				);

		//-UPLOAD PHOTO =================================
		app.get('/upload',function(req,res){

			var fs = require("fs"),
			    path = require("path");

			var p = "uploads/";
			fs.readdir(p, function (err, files) {
			    if (err) {
			        throw err;
			    }

			    files.map(function (file) {
			        return path.join(p, file);
			    }).filter(function (file) {
			        return fs.statSync(file).isFile();
			    }).forEach(function (file) {
			        console.log("%s (%s)", file, path.extname(file));
			        res.send(file);
			    });
			});

		});

		// process the upload photo
		app.post('/upload', function (req, res){
			  var size = req.headers['content-length'];
			  var maxsize=100000;

			   if (size <= maxsize) {
			  console.log(size+"------------>size");
			  console.log(maxsize+"------------>maxsize");
			  this.token="123456"
			  var that=this;
			  
			  var form = new formidable.IncomingForm();
			  form.parse(req, function(err, fields, files) {
			  	that.token=fields.token;

			    res.redirect('/');

			  });
			    form.on('error', function(message) {
			        res.status = 413;
			        res.status(413).send('Upload too large');
			        res.end();
			    });
			  form.on('end', function(fields, files) {

			    /* Temporary location of our uploaded file */
				console.log(that.token);
				var tokenSecret="ilovefastbook";
				 var user = jwt.decode(that.token, tokenSecret);


			    var temp_path = this.openedFiles[0].path;
			    /* The file name of the uploaded file */
			    var file_name = this.openedFiles[0].name;
			    /* Location where we want to copy the uploaded file */
			    var new_location = 'uploads/';
			   var extension = file_name.substring(file_name.lastIndexOf('.'));

			    fs.copy(temp_path, new_location + user._id+extension, function(err) {  
			      if (err) {
			        console.error(err);
			      } else {
			        console.log("success!")

			      }
			    });
			  });
			}else{
			     res.status(413).send("File to large");
			}
			});



	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/#home',
				failureRedirect : '/#home'
			}),function(req,res){
				res.send(req.user)
			});

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', isLoggedIn, function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('../#profile');
}
