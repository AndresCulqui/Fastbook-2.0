var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var users  = new Schema({
	name: String,
	email: String,
	password: String,
        modified: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('User', users);
