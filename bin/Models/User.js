let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		minLenght: 3,
		maxLenght: 20,
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		maxLength: 100,
	},
	password: {
		type: String,
		required: true,
		minLenght: 8,
		maxLenght: 100,
	},
	remember_token: {
		type: String,
		unique: true,
		required: true,
	},
	// friends: [{
	// 	type: Schema.type.ObjectId,
	// 	ref: User
	// }]
});

UserSchema.plugin(uniqueValidator, {message: 'Path `{PATH}` already in use'});

let User = mongoose.model('User', UserSchema);


module.exports = User;