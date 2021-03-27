const createError = require('http-errors');
const User = require('../Models/User.js');

let user;

const middleware = async (req, res, next) => {
	// console.info(req.cookies)
	let s_user = req.session.user;
	
	if (s_user) {
		user = await User.findOne({
			remember_token: req.cookies.ut
		})

		// console.log(user)

		if (user) {
			return next()
		}
	}

	res.status(401);
	return res.redirect('/auth/login')
}

const index = (req, res, next) => {
	// console.log('user', req.session)
	return res.render('chat', {
		user: user
	});
}

module.exports = {
	middleware,
	index
};