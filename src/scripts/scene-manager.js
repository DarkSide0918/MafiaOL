function switchScenes(scene) {

	closeAllScenes();

	switch (scene) {

		case "authentication":

			if (autoLogin) {

				switchScenes("home");

			} else {

				document.getElementById("authentication-scene").hidden = false;
				document.getElementById("master-navigation-buttons-container").hidden = true;

			}

		break;

		case "room-list": 

			document.getElementById("room-list-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = false;

		break;

		case "home": 

			document.getElementById("home-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = false;

		break;

		case "account":

			loadAccountInformation();

			document.getElementById("account-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = false;

		break;

		case "create-room":

			document.getElementById("create-room-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = false;

		break;

		case "room": 

			document.getElementById("room-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = true;

		break;

		case "game": 

			document.getElementById("game-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = true;

		break;

		default: 

			document.getElementById("coming-soon-scene").hidden = false;
			document.getElementById("master-navigation-buttons-container").hidden = false;

		break;

	}

}

function closeAllScenes() {

	// Hide Flex-boxes
	document.getElementById("introduction-scene").style = "display: none;";

	// Hide All Scenes
	document.getElementById("introduction-scene").hidden = true;
	document.getElementById("authentication-scene").hidden = true;
	document.getElementById("home-scene").hidden = true;
	document.getElementById("room-list-scene").hidden = true;
	document.getElementById("room-scene").hidden = true;
	document.getElementById("game-scene").hidden = true;
	document.getElementById("account-scene").hidden = true;
	document.getElementById("settings-scene").hidden = true;
	document.getElementById("store-scene").hidden = true;
	document.getElementById("social-scene").hidden = true;
	document.getElementById("create-room-scene").hidden = true;
	document.getElementById("coming-soon-scene").hidden = true;

}

function loading() {


}