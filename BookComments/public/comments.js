const inputCommentBook = document.getElementById('inputCommentBook');
const inputCommentText = document.getElementById('inputCommentText');

const regCommentButton = document.getElementById('regCommentButton');
const getCommentsButton = document.getElementById('getCommentsButton');
const connectWsButton = document.getElementById('connectWsButton');

const commentResult = document.getElementById('commentResult');
const commentsList = document.getElementById('commentsList');

function registerNewComment() {
	let comment = {
		bookId: inputCommentBook.value,
		comment: inputCommentText.value,
	};

	commentResult.text = '';
	regCommentButton.disabled = true;

	console.log(JSON.stringify(comment));

	const url =
		'http://localhost:3000/api/comments/book/' + inputCommentBook.value;
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: 'Bearer ' + userToken,
		},
		body: JSON.stringify(comment),
	}).then((res) =>
		res.json().then((data) => {
			commentResult.innerHTML = JSON.stringify(data).replace(/,/g, ', ');
			regCommentButton.disabled = false;
			// отправляем WebSocket-сообщение
			if (socket) {
				socket.emit('newBookComment', data);
			}
		}),
	);
}

function getComments() {
	commentResult.text = '';
	getCommentsButton.disabled = true;

	let url = 'http://localhost:3000/api/comments';

	if (inputCommentBook.value) {
		url += '/book/' + inputCommentBook.value;
	}

	fetch(url).then((res) =>
		res.json().then((data) => {
			commentResult.innerHTML = JSON.stringify(data).replace(/,/g, ', ');
			getCommentsButton.disabled = false;
		}),
	);
}

regCommentButton.addEventListener('click', registerNewComment);
getCommentsButton.addEventListener('click', getComments);


function connectWs() {
	socket = io.connect('http://localhost:3000');

	socket.on('connect', () => {
		socket.emit('ping', (answer) => console.log(answer));

		socket.on('newBookComment', (msg) => {
			let div = '<div>' + JSON.stringify(msg) + '</div>';
			commentsList.insertAdjacentHTML('beforeend', div);
		});

		socket.on('getBookComments', (msg) => {
			commentsList.innerHTML = '';
			msg.json().then((data) => {
				for (el of data) {
					let div = '<div>' + JSON.stringify(el) + '</div>';
					commentsList.insertAdjacentHTML('beforeend', div);
				}
			});
		});

		// При заполнении BookID посылаем сообщение
		inputCommentBook.onchange = (e) => {
			if (isNaN(inputCommentBook.value)) {
				e.preventDefault();
			}

			// Отправляем содержимое input'а, закодированное в escape-последовательность
			socket.emit('getBookComments', inputCommentBook.value, (answer) => {
				commentsList.innerHTML = '';
				console.log(answer);
				for (el of answer) {
					let div = '<div>' + JSON.stringify(el) + '</div>';
					commentsList.insertAdjacentHTML('beforeend', div);
				}
			});
		};
	});
}

connectWsButton.onclick = function () {
	connectWs();
	return false;
};
