const inputLogin = document.getElementById('inputLogin');
const inputPassword = document.getElementById('inputPassword');
const inputName = document.getElementById('inputName');
const inputEmail = document.getElementById('inputEmail');

const authButton = document.getElementById('authButton');
const regButton = document.getElementById('regButton');

const userResult = document.getElementById('userResult');


function registerUser() {
	let user = {
		login: inputLogin.value,
		password1: inputPassword.value,
		password2: inputPassword.value,
		firstName: inputName.value,
		email: inputEmail.value
	};

	userResult.text = "";
	regButton.disabled = true;

	console.log(JSON.stringify(user));

	fetch('http://localhost:3000/api/users/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(user)
	}).then((res) => res.json().then((data) => {
		userResult.innerHTML = JSON.stringify(data).replace(/,/g, ", ");
		regButton.disabled = false;
	}));
}


function getUserToken() {
	let user = {
		login: inputLogin.value,
		password: inputPassword.value
	};

	userResult.text = "";
	authButton.disabled = true;

	fetch('http://localhost:3000/api/users/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(user)
	}).then((res) => res.text().then((data) => {
		userResult.innerHTML = data;
		authButton.disabled = false;
		userToken = data;
	}));
}


regButton.onclick = function () {
	registerUser();
	return false;
};

authButton.onclick = function () {
	getUserToken();
	return false;
};