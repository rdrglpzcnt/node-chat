//socket stuff
// let cookies = require('js-cookie');
let socket = io();
let username = $('input[name=username]').val();
let socket_user = null;

//elements
let $chat_form = $('#chat-form');
let $chat_input = $chat_form.find('input');
let $chat_display = $('.chat-display');
let $chat_userlist = $('#userlist');
let $statusbar = $('.statusbar');
let $users_typing = $('.users-typing');
let BASE_URL = $('input[name=base_url]').val();


// on connect
socket.on('connect', () => {
	socket.emit('user_join', username, (s_user) => {
		let status_bar_text = s_user ? 'Estas conectado!' : 'Error de coneccion';

		if (!s_user) {
			socket.close();
		}
		
		socket_user = s_user
		$statusbar.text(status_bar_text);
		$statusbar.addClass('hidden');
	});
});

//on socket error
socket.on('error', (err) => {
	console.error(err)
	if (err == 401) {
		window.location = BASE_URL + 'auth/login'
	}
})


//chat usage events
socket.on('user_jioned', (user) => {
	appendToChatDisplay(`<p>${user.username} se conectó al chat! 👋</p>`);
});

socket.on('user_left', (user) => {
	appendToChatDisplay(`<p>${user.username} se desconectó 🏃‍♂️</p>`);
	removeTypingUser(user);
});

socket.on('message', (msg, user) => {
	let html = getMessageHtml(msg, user);
	appendToChatDisplay(html);
});

socket.on('update_userlist', (userlist) => {
	$chat_userlist.html('');
	userlist.forEach( user => {
		$chat_userlist.append(`<p data-id="${user.s_id}"> ${user.username} </p>`);
	});
});


//user typyng events
socket.on('user_typing', (user) => {
	let appended = $chat_userlist.children(`[data-id="${user.s_id}"]`).children('[data-name="typing"]');

	if (!appended.length) {
		$chat_userlist.children(`[data-id="${user.s_id}"]`).append('<span data-name="typing">📝</span>');
	}
});

socket.on('user_typing_end', (user) => {
	// removeTypingUser(user);
	$chat_userlist.children(`[data-id="${user.s_id}"]`).children('[data-name="typing"]').remove();
});



// ui events
let is_typing = false;
$chat_input.on('keyup', function() {
	if ($(this).val() && !is_typing) {
		socket.emit('user_typing', username);
		is_typing = true
	}

	if (!$(this).val() && is_typing) {
		socket.emit('user_typing_end', username);
		is_typing = false
	}

	
});

$chat_input.on('focus', function() {
	if ($(this).val()) {
		socket.emit('user_typing', username);
		is_typing = true
	}
});

$chat_input.on('blur', function() {
	if (!is_typing) { return false }
	socket.emit('user_typing_end', username);
	is_typing = false
});


$chat_form.on('submit', function() {
	event.preventDefault();
	socket.emit( 'message', $chat_input.val() );
	$chat_input.val('');
});


//functions
const appendToChatDisplay = (appendable) => {
	let $appendable = $(appendable);
	$appendable.addClass('chat-item hidden');
	$chat_display.append($appendable);
	$chat_display.scrollTop($chat_display.prop('scrollHeight'));
	$appendable.removeClass('hidden');
}


const removeTypingUser = (user) => {
	$users_typing.find(`[data-id=${user.s_id}]`).remove();

	if (!$users_typing.children('div').length) {
		$users_typing.removeClass('active');
	}
}

const getMessageHtml = (msg, user) => {
	let is_local_message = user.s_id == socket_user.s_id;
	return `
		<div class="chat-message-row ${ is_local_message ? 'local' : 'remote' } ">
			<p class="chat-message">
				<b>${ !is_local_message ? user.username + ':' : '' }</b>
				${ msg }
			</p>
		</div>`
}