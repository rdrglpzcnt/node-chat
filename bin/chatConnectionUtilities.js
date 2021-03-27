const isValidUsername = (username, users) => {
	return !users.filter((user) => {
		return user.username == username;
	}).length;
};

const removeUserFromList = (users, user) => {
	if (users.includes(user)) {
		users.splice(users.indexOf(user), 1)
	} else {
		console.log('user not found')
	}
};

module.exports = {
	isValidUsername,
	removeUserFromList
}