class Helpers {
	constructor(app) {
		this.locals = app.locals;
	}

	//recibe un tring, y lo regresa concatenado con baseurl declarado en app.locals
	url(str = '') {
		str = str.length && str.charAt(0) == '/'
			? str
			: '/' + str; 	
		return this.locals.baseUrl + str;
	}
}



module.exports = Helpers;