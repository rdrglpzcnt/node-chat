const User = require('../Models/User.js');

module.exports = async (req, res, next) => {
	let user = await User.findOne(req.session.user).exec()
		.then(u => {
			return u
		})
		.catch(e => {
			return null
		});
	
	if (!user) {
		next(new Error('401'))
	} 
	next();
}