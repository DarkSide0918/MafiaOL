// Server Synchronization

function syncGame() {

	firebase.database().ref("rooms/" + myRoomName + "/characters").on("value", function (snapshot) {

		if (snapshot.val() != null) {

			var characterKeys = Object.keys(snapshot.val());

			console.log(characterKeys.length);

			for (var i = 1; i <= characterKeys.length; i++) {

				var ownedCharacter = "";
				var otherCharacter = "";

				if (snapshot.child(i).child("o").val() == userName) {

					ownedCharacter += "<button class='owned-chr card owned-hr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`)'>";
					
					ownedCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val() + " <br> " + "Owned " + snapshot.child("r").val();
					ownedCharacter += "</button>";

				} else {

					otherCharacter += "<button class='card other-chr' id='" + i + "' onclick='funcClickCharacter(" + i + ", " + snapshot.child("r").val() + ")'>";
					otherCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val();
					otherCharacter += "</button>";

				}

				document.getElementById("game-scene").innerHTML += ownedCharacter;
				document.getElementById("game-scene").innerHTML += otherCharacter;

			}

			firebase.database().ref("rooms/" + myRoomName + "/characters").off();

		} else {

			firebase.database().ref("rooms/" + myRoomName + "/characters").off();

			firebase.database().ref("rooms/" + myRoomName + "/characters").on("child_added", function(snapshot) {

				var ownedCharacter = "";
				var otherCharacter = "";

				if (snapshot.child("o").val() == userName) {
					
					ownedCharacter += "<button class='owned-chr card owned-hr' id='" + snapshot.key + "' onclick='funcClickCharacter(" + snapshot.key + ", " + snapshot.child("r").val() + ")'>";
					ownedCharacter += snapshot.child("n").val() + " <br> " + snapshot.child("d").val() + " <br> " + "Owned " + snapshot.child(i).child("role").val();
					ownedCharacter += "</button>";

				} else {

					otherCharacter += "<button class='card other-chr' id='" + snapshot.key + "' onclick='funcClickCharacter(" + snapshot.key + ", " + snapshot.child("r").val() + ")'>";
					otherCharacter += snapshot.child("n").val() + " <br> " + snapshot.child("d").val();
					otherCharacter += "</button>";

				}

				document.getElementById("game-scene").innerHTML += ownedCharacter;
				document.getElementById("game-scene").innerHTML += otherCharacter;

				funcClickCharacter(0, 0); 

			});

		}

	});

}

function funcAwaitSyncGame() {



}

function funcDetachSyncGameListeners() {

	firebase.database().ref("rooms/" + myRoomName + "/characters").off();

}

function funcClickCharacter(chrId, chrRole) {

	switch (intActionPhase) {

		case 0:

			var arrOtherCharacters = document.getElementsByClassName("other-chr");
			var arrOwnedCharacters = document.getElementsByClassName("owned-chr");

			for (var i = 0; i < arrOtherCharacters.length; i++) {

				arrOtherCharacters[i].disabled = true;

			}

			for (var i = 0; i < arrOwnedCharacters.length; i++) {

				arrOwnedCharacters[i].disabled = false;

			}

			intActionPhase = 1;

		break;

		case 1:

			funcSelectChr(chrRole);

			var arrOwnedCharacters = document.getElementsByClassName("owned-chr");

			for (var i = 0; i < arrOwnedCharacters.length; i++) {

				arrOwnedCharacters[i].disabled = true;

			}

		break;

		case 2:

			var arrOtherCharacters = document.getElementsByClassName("other-chr");

			for (var i = 0; i < arrOtherCharacters.length; i++) {

				arrOtherCharacters[i].disabled = false;

			}

		break;

		case 3:

			console.log("chrId is " + chrId);

			funcManageSelectButton();
			funcSelectTarget(chrId);

			intActionPhase = 0;
			funcClickCharacter(0, 0);

		break;

	}

	console.log(chrId, chrRole, intActionPhase);

}

function funcSelectChr(role) {

	switch (role) {

		case "an": 

			funcManageSelectButton();
			document.getElementById("button-select-assassinate").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;

		break;

		case "hr":

			funcManageSelectButton();
			document.getElementById("button-select-hunt").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;
		
		break;

		case "bd":

			funcManageSelectButton();
			document.getElementById("button-select-bodyguard").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;
		
		break;

		case "tr":

			funcManageSelectButton();
			document.getElementById("button-select-tend").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;
		
		break;

		case "mr":

			funcManageSelectButton();
			document.getElementById("button-select-message").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;

		break;

		case "ir":

			funcManageSelectButton();
			document.getElementById("button-select-investigate").hidden = false;
			document.getElementById("button-select-suicide").hidden = false;

			intActionPhase = 2;
		
		break;

	}

}

function funcManageSelectButton() {

	document.getElementById("button-select-assassinate").hidden = true;
	document.getElementById("button-select-hunt").hidden = true;
	document.getElementById("button-select-bodyguard").hidden = true;
	document.getElementById("button-select-tend").hidden = true;
	document.getElementById("button-select-message").hidden = true;
	document.getElementById("button-select-investigate").hidden = true;
	document.getElementById("button-select-suicide").hidden = true;

}

function funcSelectAction(action) {

	funcClickCharacter(0, 0);

	switch (action) {

		case "assassinate":

			strSelectedAction = "assassinate";

			intActionPhase = 3;

		break;

		case "hunt":

			strSelectedAction = "hunt";

			intActionPhase = 3;

		break;

		case "bodyguard":

			strSelectedAction = "bodyguard";

			intActionPhase = 3;

		break;

		case "tend":

			strSelectedAction = "tend";

			intActionPhase = 3;

		break;

		case "message":

			strSelectedAction = "message";

			intActionPhase = 3;

		break;

		case "investigate":

			strSelectedAction = "investigate";

			intActionPhase = 3;

		break;

	}

}

function funcSelectTarget(targetId) {

	// Fetch Status Information

	console.log("targetId is " + targetId);

	var strStatus = "";

	firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId + "/s").once("value", (snapshot) => {

		strStatus = snapshot.val();

	});

	// Act

	if (true/*intActionsRemaining >= 1*/) {

		switch (strSelectedAction) {

			case "assassinate":

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(true);

					break;

					case "si":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(true);

					break;

					case "ai":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(true);

					break;

					case "b":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "aa"

						});

						funcActionFeedback(true);

					break;

					default: 

						funcActionFeedback(false);

					break;

				}

			break;

			case "hunt":

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "si"

						});

						funcActionFeedback(true);

					break;

					case "b":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "ai"

						});

						funcActionFeedback(true);

					break;

					default: 

						funcActionFeedback(false);

					break;

				}

			break;

			case "bodyguard":

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "b"

						});

						funcActionFeedback(true);

					break;

					case "sa":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "aa"

						});

						funcActionFeedback(true);

					break;

					case "si":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "ai"

						});

						funcActionFeedback(true);

					break;

					default: 

						funcActionFeedback(false);

					break;

				}

			break;

			case "tend":

				switch (strStatus) {

					case "i":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "t"

						});

						funcActionFeedback(true);

					break;

					default: 

						funcActionFeedback(false);

					break;

				}

			break;

			case "message":

				strSelectedAction = "message";

			break;

			case "investigate":

				strSelectedAction = "investigate";

			break;

		}

	}

}

function funcActionFeedback(status) {

	if (status) {

		intActionsRemaining --;
		intActionPhase = 0;

	} else {

		alert

	}

}