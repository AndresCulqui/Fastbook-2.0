// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1503835363198599', // your App ID
		'clientSecret' 	: 'a9baa5fa7472fc07cad9cc61138e61ec', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '3TR2xCfSkjtmT9ytZcBf0fT2b',
		'consumerSecret' 	: '7WWE2vkN5KMi8nu6N3JZQudZD2kmM6ra1tQ4b13oGqz7FTlwZq',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '768969970497-j73ejp1juep7a0lm1s8tmn284mg9ogmg.apps.googleusercontent.com',
		'clientSecret' 	: 'yPKHmbBI5zj-hHJ14Y60u5Gk',
		'callbackURL' 	: 'http://fastbook.com:8080/auth/google/callback'
	}

};
