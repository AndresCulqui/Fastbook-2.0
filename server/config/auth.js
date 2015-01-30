// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1503835363198599', // your App ID
		'clientSecret' 	: 'a9baa5fa7472fc07cad9cc61138e61ec', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '3TR2xCfSkjtmT9ytZcBf0fT2b',
		'consumerSecret' 	: '7WWE2vkN5KMi8nu6N3JZQudZD2kmM6ra1tQ4b13oGqz7FTlwZq',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '214223288758-24jri2jhnne38l3kups1om6s2r3l162v.apps.googleusercontent.com',
		'clientSecret' 	: 'fvwnTzd2rN9ojF2UNhrD7vpE',
		'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
	}

};
