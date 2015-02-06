
// User.js
//=======================================================================

module.exports = function(app) {

 var http = require('http').Server(app);

var requestify = require('requestify');
  var User = require('../model/user.js');

  //GET - Return all users in the DB
  findAllUsers = function(req, res) {
        console.log("GET - /users");
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
      return User.find(function(err, user) {
          if(!err) {
              return res.send(user);
          } else {
        res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
          }
      });
  };
 
  //GET - Return a Book with specified ID
 /* findById = function(req, res) {
        console.log("GET - /book/:id");
    return Book.findById(req.params.id, function(err, book) {
      if(!book) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        // Send { status:OK, tshirt { tshirt values }}
        return res.send({ status: 'OK', book:book });
        // Send {tshirt values}
        // return res.send(tshirt);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };*/
 //-----------------search by email------------
   findByEmail = function(req, res) {
        console.log("GET - /user/:email");
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        User.findOne({email: req.params.email}, function(err,user) { 

            if(!user) {
              res.statusCode = 404;
             res.send({ error: 'Not found' });
            }
            if(!err) {
             res.send({ status: 'OK User Created', user:user });
            } else {
              res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
            }
          });
  };
  
  
 
  //POST - Insert a new User in the DB
  
  addUser = function(req, res) {
        console.log('POST - /user');
        //-------------------
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        //----------------------------------------
    console.log(req.body);

    User.findOne({email: req.body.email}, function(err,user) { 
              
        if(!user){

	          var user = new User({
            name: req.body.name,
            email :req.body.email, 
            password : req.body.password
            });
 
      	    user.save(function(err) {
        	    if(!err) {
          		  console.log("User created");
          		  res.send({ status: 'OK', user:user });
        	    } 
              else {
        		    console.log(err);
          		  if(err.name === 'ValidationError') {
          		  res.statusCode = 400;
          		  res.send({ error: 'Validation error' });
          		  } else {
          		  res.statusCode = 500;
          		  res.send({ error: 'Server error' });
          		  }
        		    console.log('Internal error(%d): %s',res.statusCode,err.message);
        	    }
      	    });
		       
        } else {
          res.send("KO");
        }
    });
   
 
  //revisar
     // res.send(user);
    
  };
  
  
  //------------------------xploit-----------------------------------
  
   addXploit = function(req, res) {
        console.log('POST - /user');
        //-------------------
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        //----------------------------------------
    console.log(req.body);
 
   /* var user = new User({
                name: req.body.name,
                email :req.body.email, 
                password : req.body.password
    });
 
    user.save(function(err) {
      if(!err) {
        console.log("User created");
        res.send({ status: 'OK', user:user });
      } else {
        console.log(err);
        if(err.name === 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        console.log('Internal error(%d): %s',res.statusCode,err.message);
      }
    });*/
 
  //revisar
     res.redirect('your/404/path.html');
    
  };
  
  
  
  
  
  
  
  
  //POST - Insert a new GoogleUser in the DB
  
  addGoogleUser = function(req, res) {
        console.log('POST - /user');
       
    
    console.log(req.body.token+"token------id");
      
    var url='https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token='+req.body.token;
    
                requestify.get(url).then(function(response) {
                    
                    //response.getBody();
                    console.log("--------------->"+response.body+" ----  bosy");
                  var body=JSON.parse(response.body);
                   // console.log(jsonconverter.id+"----------->json");
                   
                    console.log("--------------->"+body.email+" ----  bosy");
                     User.findOne({email:body.email }, function(err,user) { 

                            if(!user) {
                                var user = new User({
                                 name: body.name,
                                 email :body.email, 
                                 password :body.id

                                 });
                                 console.log("//////////------------>"+user+" ////-->user created------------");
                                 user.save(function(err) {
                                   if(!err) {
                                     console.log("User created");
                                     res.send("usuario añadido a la bd");
                                   } else {
                                     console.log(err);
                                     if(err.name === 'ValidationError') {
                                       res.statusCode = 400;
                                       res.send({ error: 'Validation error' });
                                     } else {
                                       res.statusCode = 500;
                                       res.send({ error: 'Server error' });
                                     }
                                     console.log('Internal error(%d): %s',res.statusCode,err.message);
                                   }
                                 });
                                 
                            
                            }
                                    
                                    
                                
                            
                            if(!err) {
                             res.send(
                                {
                                   name:body.name,
                                   email :body.email, 
                                   id:body.id, 
                                   image:body.picture

                                   }   );
                                 
                            } else 
                            {
                              
                            res.send({ error: 'Usuario existente' });
                            }
                          });
                   


                     });
                          

 
   
    
  };
 
 
  //PUT - Update a register already exists
  updateUser = function(req, res) {
    console.log("PUT - /user/:email");
    console.log(req.body);
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
   User.findOne({email: req.params.email}, function(err,user) {
      if(!user) {
        res.statusCode = 404;
        res.send({ error: 'Not found' });
      }
 
      user.name = req.body.name;
      user.email = req.body.email;
      user.password= req.body.password; 
  
 
     user.save(function(err) {
        if(!err) {
          console.log('Updated');
          res.send({ status: 'OK', user:user });
        } else {
          if(err.name === 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }
 //revisar
        res.send(user);
      });
   
    });

  };
 
  //DELETE - Delete a User with specified ID
  deleteUser = function(req, res) {
       console.log("DELETE - /user/:email");
       res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
     User.findOne({email: req.params.email}, function(err,user) {
      if(!user) {
        res.statusCode = 404;
      res.send({ error: 'Not found' });
      }
 
     user.remove(function(err) {
        if(!err) {
          console.log('user deleted');
          res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
      });
    });
  };
  
  
 
  //Link routes and functions
  app.get('/users', findAllUsers);
  app.get('/user/:email', findByEmail);
  app.post('/googleUser', addGoogleUser);
  app.post('/user', addUser);
  app.post('/userXploit',addXploit);
  
  app.put('/user/:email', updateUser);
  app.delete('/user/:email', deleteUser);
 
};


