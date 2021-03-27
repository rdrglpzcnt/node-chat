const chatUtilities = require('./chatConnectionUtilities.js');

module.exports = (io, client, users) => {
	
	//user join lobby
	client.on('user_join', (username, res) => {
		let is_valid = chatUtilities.isValidUsername(username, users);
		
		if (is_valid) {
			//attach user data to client
			client.user = {
				s_id: client.id,
				username,
			};

			client.join('lobby');
			users.push(client.user);
			io.to('lobby').emit('user_jioned', client.user);
			io.to('lobby').emit('update_userlist', users);
			return res(client.user);
		}

		res(is_valid)
	})


	//user message
	client.on('message', (message) => {
		io.to('lobby').emit('message', message, client.user)
	})

	//user typing events
	client.on('user_typing', () => {
		client.broadcast.to('lobby').emit('user_typing', client.user)
	});

	client.on('user_typing_end', () => {
		client.broadcast.to('lobby').emit('user_typing_end', client.user)
	});



	//on disconnect
	client.on('disconnect', (socket) => {
		if (!client.user) return false
		
		io.to('lobby').emit('user_left', client.user)
		chatUtilities.removeUserFromList(users, client.user)
		io.to('lobby').emit('update_userlist', users);
	})

};