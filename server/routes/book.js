
// book.js
//=======================================================================

module.exports = function(app) {

 var http = require('http').Server(app);
var io = require('socket.io')(http);

  var Book = require('../model/book.js');
 var id=1;
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
  
  
 
  //POST - Insert a new Book in the DB
  addBook = function(req, res) {
        console.log('POST - /book');
        //-------------------
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        //----------------------------------------
    console.log(req.body);
 
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
                price: req.body.price
              
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
 
    res.send(book);
    id++;
  };
 
  //PUT - Update a register already exists
  updateBook = function(req, res) {
    console.log("PUT - /book/:isbn");
    console.log(req.body);
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
   Book.findOne({isbn: req.params.isbn}, function(err,book) {
      if(!book) {
        res.statusCode = 404;
        res.send({ error: 'Not found' });
      }
 
      book.author = req.body.author;
      book.year = req.body.year;
      book.publisher = req.body.publisher; 
      book.isbn = req.body.isbn;
      book.genre  = req.body.genre;
      book.description = req.body.description;
      book.title = req.body.title;
      book.status=req.body.status;
      book.province=req.body.province;
      book.imagen=req.body.imagen;
      book.price=req.body.price;
  
 
     book.save(function(err) {
        if(!err) {
          console.log('Updated');
          res.send({ status: 'OK', book:book });
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
 
        res.send(book);
      });
   
    });

  };
 
  //DELETE - Delete a Book with specified ID
  deleteBook = function(req, res) {
       console.log("DELETE - /book/:id");
       res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
     Book.findOne({isbn: req.params.isbn}, function(err,book) {
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
  app.post('/book', addBook);
  app.put('/book/:isbn', updateBook);
  app.delete('/book/:isbn', deleteBook);
  app.get('/lastBooks', lastBooks);
 
};



