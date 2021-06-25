function authentication() {

	var usernameEntered = document.getElementById("username-input").value;
	var passwordEntered = document.getElementById("password-input").value;

	firebase.auth().signInWithEmailAndPassword(usernameEntered, passwordEntered).then(manualLogin = true)
		.catch((error) => {

			console.log(error.message);

		});

	return false;

}

firebase.auth().onAuthStateChanged(firebaseUser => {

	if (firebaseUser) {

		userEmail = firebaseUser.email;

		var index = userEmail.indexOf("@");
		userName = userEmail.substring(0, index);

		autoLogin = true;

		if (manualLogin) {

			switchScenes("home");

		}

	} else {

	}

});

function signOutAccount() {

	autoLogin = false;
	firebase.auth().signOut();

	switchScenes("authentication");

}