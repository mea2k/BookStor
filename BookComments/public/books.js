const inputBookTitle = document.getElementById('inputBookTitle');
const inputBookDesc = document.getElementById('inputBookDesc');
const inputBookAuthors = document.getElementById('inputBookAuthors');

const regBookButton = document.getElementById('regBookButton');

const bookResult = document.getElementById('bookResult');


function registerNewBook() {
	let book = {
		title: inputBookTitle.value,
		description: inputBookDesc.value,
		authors: inputBookAuthors.value,
	};

	bookResult.text = "";
	regBookButton.disabled = true;

	console.log(JSON.stringify(book));

	fetch('http://localhost:3000/api/books', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + userToken
		},
		body: JSON.stringify(book)
	}).then((res) => res.json().then((data) => {
		bookResult.innerHTML = JSON.stringify(data).replace(/,/g, ", ");
		regBookButton.disabled = false;
	}));
}



regBookButton.onclick = function () {
	registerNewBook();
	return false;
};

