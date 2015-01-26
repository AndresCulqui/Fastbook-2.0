var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var user  = new Schema({
	name: String,
	email: String,
	password: String,
        modified: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('User', user);
