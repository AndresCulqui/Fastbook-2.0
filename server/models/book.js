var mongoose     = require('mongoose');
var User=mongoose.model('User');
var Schema       = mongoose.Schema;
var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String}
});



var Book   = new Schema({
	author: String,
        value: Number,
        title: String,
        publisher:   String ,
        isbn:  Number ,
        genre: String,
        description:  String ,
        status:String,
        province:String,
         price: Number,
         imagen:String,
       // id_user:{type: Schema.ObjectId, ref: "User"},
       id_user:String,
        modified: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('Book', Book);
