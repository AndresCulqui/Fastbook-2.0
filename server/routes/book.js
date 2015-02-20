
// book.js
//=======================================================================

module.exports = function(app) {

  var jwt = require('jwt-simple');



 var http = require('http').Server(app);
var io = require('socket.io')(http);
var requestify = require('requestify');

  var Book = require('../models/book.js');
   var User = require('../models/user.js');
 var id=1;
   var tokenSecret="ilovefastbook";
  //GET - Return all books in the DB
  findAllBooks = function(req, res) {
        console.log("GET - /books");
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
      return Book.find(function(err, books) {
          if(!err) {
              return res.send(books);
          } else {
        res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
          }
      });
  };
 
  //GET - Return a Book with specified ID
  findById = function(req, res) {
        console.log("GET - /book/id/:id");
      Book.findById(req.params.id, function(err, book) {
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
  };
 //--------------------buscar por isbn------------
   findByIsbn = function(req, res) {
        console.log("GET - /book/:isbn");
        console.log(req.params.isbn);
         res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        Book.findOne({isbn: req.params.isbn}, function(err,book) { 

            if(!book) {
              res.statusCode = 404;
             res.send({ error: 'Not found' });
            }
            if(!err) {
             res.send({ status: 'OK', book:book });
            } else {
              res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
            }
          });
  };


  //GET - find books by Id_user
   findByUser = function(req, res) {
        console.log("GET - /user/:id_user");
       
         res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        console.log(req.params.user);
        var token = jwt.decode(req.params.user, tokenSecret);


        Book.find({id_user:token._id}, function(err,books) { 

            if(!books) {
              res.statusCode = 404;
             res.send({ error: 'Not found' });
            }
            if(!err) {
             res.send({ status: 'OK', books:books });
            } else {
              res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
            }
          });
  };



 //GET - findBooks book by core-search//////////////////////////////////////////////////
findBooks = function(req, res) {
  console.log(req.body);
        console.log("POST - /books/find/:book");
        
        
     Book.find(req.body, function(err, book) {
      if(!book) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        console.log(book);
        // Send { status:OK, tshirt { tshirt values }}
       res.send({ status: 'OK', book:book });
        // Send {tshirt values}
        // return res.send(tshirt);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
      }
    });
  };


 //GET - find book by Id_user//////////////////////////////////////////////////
findBookByIdUser = function(req, res) {
        console.log("GET - /book/:id_book/:id_user");
        var book = req.params.id_book;
        var user = jwt.decode(req.params.id_user, tokenSecret);
        
      Book.find({_id:ObjectId(book), id_user:user._id}, function(err, book) {
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
  };
  
  //POST - Insert a new Book in the DB
  addBook = function(req, res) {
        console.log('POST - /book');
        //-------------------
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        //----------------------------------------
 
  
    var token = jwt.decode(req.body.id_user, tokenSecret);
       console.log(token._id+"---useriddd");

 User.findById(token._id, function(err, user) {
     if(!user) {
        res.statusCode = 404;
        return res.send({ error: 'Invalid token' });
      }
      if(!err){
             var book = new Book({
                title: req.body.title,
                author :req.body.author, // set the books name (comes from the request)
                year : req.body.year,
                publisher : req.body.publisher,
                isbn : req.body.isbn,
                genre : req.body.genre,
                description : req.body.description,
                status:req.body.status,
                province:req.body.province,
                imagen:req.body.imagen,
                price: req.body.price,
                value: req.body.value,
                id_user:token._id
              
            });
 
          book.save(function(err) {
            if(!err) {
              console.log("Book created");
               io.emit('bookAdd', { message: 'Book added!', book:book });
              return res.send({ status: 'OK', book:book });
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
        } else {
              res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
            }
     });        
  };
 
  //PUT - Update a register already exists
  updateBook = function(req, res) {
    console.log("PUT - /book/:id");
    console.log(req.body);
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        
        var id=req.params.id;
        var token=req.body.token;

        var user = jwt.decode(token, tokenSecret);
      console.log(user._id+"-------------id user");
      console.log(id+"-------------id book");
      
      console.log("----------------------------------");
              
      Book.findOne({_id:id, id_user:user._id}, function(err, book) {
        console.log(book);
        console.log("no hay error");
        console.log(book);
        console.log(req.body.title);
        if(book){
          book.author = req.body.author;
          book.publisher = req.body.publisher; 
          book.isbn = req.body.isbn;
          book.genre  = req.body.genre; 
          book.description = req.body.description;
          book.title = req.body.title;
          book.status=req.body.status;
          book.province=req.body.province;
          book.imagen=req.body.imagen;
          book.price=req.body.price;
          book.value = req.body.value;
          book.id_user=req.body.id_user;
          
          book.save(function(error){
            if(!error){
              res.send({book:book});
            }else{
              res.send("error");
            }
            
          });
        }
          else{
            res.send("not found");
          }

    });
      
  };
 
  //DELETE - Delete a Book with specified ID
  deleteBook = function(req, res) {
       console.log("DELETE - /book/:id");
       res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        
        
      var token=req.params.token;

      var user = jwt.decode(token, tokenSecret);
  
     Book.findOne({_id: req.params.id,id_user:user._id}, function(err,book) {
      if(!book) {
        res.statusCode = 404;
      res.send({ error: 'Not found' });
      }
 
     book.remove(function(err) {
        if(!err) {
          console.log('Removed book');
          res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
      });
    });
  };
  
  lastBooks = function(req, res) {
        console.log("GET - /books");
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
      return Book.find().sort({ field: 'asc', _id: -1 }).limit(5).find(function(err, books) {
          
 
          
          if(!err) {
              return res.send(books);
              
          } else {
        res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
          }
      });
  };
 
  //Link routes and functions
  app.get('/books', findAllBooks);
  app.get('/book/:isbn', findByIsbn);
   app.get('/books/user/:user', findByUser);
   app.post('/books/find', findBooks);
   app.get('/book/book/:id_book/:id_user', findBookByIdUser);
   app.get('/book/id/:id', findById);
  app.post('/book', addBook);
  app.put('/book/:id', updateBook);
  app.delete('/book/:id/:token', deleteBook);
  app.get('/lastBooks', lastBooks);
 
};



