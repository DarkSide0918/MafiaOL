function loadAccountInformation() {

	var username = "";
	var credits = "";
	var points = "";
	var title = "";

	var index = userEmail.indexOf("@");
	username = userEmail.substring(0, index);

	firebase.database().ref("accounts/" + username).once("value", (snapshot) => {

		credits = snapshot.val().credits;
		points = snapshot.val().points;
		title = snapshot.val().title;

		document.getElementById("account-username-display").innerHTML = "Username: " + username;
		document.getElementById("account-credits-display").innerHTML = "Credits: " + credits;
		document.getElementById("account-points-display").innerHTML = "Points: " + points;
		document.getElementById("account-title-display").innerHTML = "Title: " + title;

	});

}

function customizeAccount(type, value) {

	switch (type) {

		case "nationality": 

		break;
		case "title": 

		break;

	}

}