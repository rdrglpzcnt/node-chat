var session = require('express-session');

module.exports = session({
	secret: 'secret_key',
	resave: false,
	saveUninitialized: true
})