const User = require('../Models/User.js');
const rand = require('randomstring') 


//login
const login = async (req, res) => {

	let user = await User.findOne({
		username: req.body.username,
		password: req.body.password
	}).exec()
		.then(u => {
			return u
		})
		.catch(e => {
			return null
		});

	if (!user) {
		req.flash('form_error', { message: 'Incorrect data' });
		req.flash('old', { username } = req.body);
		return res.redirect('/auth/login')
	}

	authClient(req, res, user)
	return res.redirect('/chat');

};

// logout
const logout = (req, res, next) => {
	authClient(req, res)
	return res.redirect('/')
};


//register
const register = async (req, res) => {
	//check password confirmation
	if (req.body.password != req.body.password_confirmation) {
		req.flash('form_error', {
			path: 'password',
			message: 'Las contraseñas no son iguales'
		});
		req.flash('old', req.body);

		return res.redirect('/auth/register');
	}

	// create user
	let user = new User(req.body);

	//append remember token
	user.remember_token = rand.generate({
		length: 64,
	});

	try {
		await user.save();
	} catch(error) {

		Object.keys(error.errors).forEach( e => {
			req.flash('form_error', {path, message} = error.errors[e]);
		});

		req.flash('old', req.body);

		return res.redirect('/auth/register');
	}

	authClient(req, res, user);
	return res.redirect('/chat');
};





//auth client function
function authClient(req, res, user) {
	if (user) {
		req.session.user = user;
		res.cookie('ut', user ? user.remember_token : undefined);
	} else {
		req.session.destroy();
		res.clearCookie('ut');
	}
};


module.exports = {
	login,
	logout,
	register,
};