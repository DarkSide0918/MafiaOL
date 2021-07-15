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

			funcClickCharacter(0, 0); 

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

	firebase.database().ref("rooms/" + myRoomName + "/round").on("value", function (snapshot) {

		if (snapshot.val() <= intActionPointCapacity) {

			intActionPointsRemaining = snapshot.val();

		} else {

			intActionPointsRemaining = 10;

		}

	});

	// Check if display host-exclusive buttons

	if (boolIsHost) {

		document.getElementById("input-board-file-upload").hidden = false;

	} else {

		document.getElementById("input-board-file-upload").hidden = true;

	}

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

function funcSelectChr(role, name) {

	strSelectedChrName = name;

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
			document.getElementById("input-messenger-field").hidden = false;
			document.getElementById("input-messenger-submit").hidden = false;

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
	document.getElementById("button-select-investigate").hidden = true;
	document.getElementById("button-select-suicide").hidden = true;
	document.getElementById("input-messenger-field").hidden = true;

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

	switch (strSelectedAction) {

		case "assassinate":

			if (intActionPointsRemaining >= 5 && strGameMode == "FFA" || intActionPointsRemaining >= 4 && strGameMode == "Team") {

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(0);

					break;

					case "si":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(0);

					break;

					case "ai":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "sa"

						});

						funcActionFeedback(0);

					break;

					case "b":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "aa"

						});

						funcActionFeedback(0);

					break;

					default: 

						funcActionFeedback(0);

					break;

				}

				if (strGameMode == "FFA") 
					intActionPointsRemaining -= 4;
				else
					intActionPointsRemaining -= 3;

			} else {

				funcActionFeedback(1);

			}

		break;

		case "hunt":

			if (intActionPointsRemaining >= 4 && strGameMode == "FFA" || intActionPointsRemaining >= 3 && strGameMode == "Team") {

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "si"

						});

						funcActionFeedback(0);

					break;

					case "b":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "ai"

						});

						funcActionFeedback(0);

					break;

					default: 

						funcActionFeedback(0);

					break;

				}

				if (strGameMode == "FFA") 
					intActionPointsRemaining -= 4;
				else
					intActionPointsRemaining -= 3;

			} else {

				funcActionFeedback(1);

			}

		break;

		case "bodyguard":

			if (intActionPointsRemaining >= 2) {

				switch (strStatus) {

					case "n":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "b"

						});

						intActionPointsRemaining -= 2;
						funcActionFeedback(0);

					break;

					case "sa":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "aa"

						});

						intActionPointsRemaining -= 2;
						funcActionFeedback(0);

					break;

					case "si":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "ai"

						});

						intActionPointsRemaining -= 2;
						funcActionFeedback(0);

					break;

					default: 

						intActionPointsRemaining -= 2;
						funcActionFeedback(0);

					break;

				}

			} else {

				funcActionFeedback(1);

			}

		break;

		case "tend":

			if (intActionPointsRemaining >= 5) {

				switch (strStatus) {

					case "i":

						firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).update({

							s: "t"

						});

						intActionPointsRemaining -= 5;
						funcActionFeedback(0);

					break;

					default: 

						intActionPointsRemaining -= 5;
						funcActionFeedback(0);

					break;

				}

			} else {

				funcActionFeedback(1);

			}

		break;

		case "message":

			if (intActionPointsRemaining >= 1) {

				firebase.database().ref("rooms/" + myRoomName + "/messages").update({

					// "t" = type, "s" = sender, "r" = receiver, "m" = message
					// Types: "s" = secret, "p" = public

					t: "s",
					s: strSelectedChrName,
					r: targetId, //if class list contans owned-chr then display message
					m: document.getElementById("input-messenger-field").value,


				});

				intActionPointsRemaining -= 1;
				funcActionFeedback(0);

			} else {

				funcActionFeedback(1);

			}

		break;

		case "investigate":

			if (intActionPointsRemaining >= 2) {

				firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).once("value", function(snapshot) {

					switch (snapshot.child("r").val()) {

						case "an": 

							document.getElementById(targetId).innerHTML += "<p> Assassin owned by " + snapshot.child("owner").val() + "</p>";

						break;

						case "hr": 

							document.getElementById(targetId).innerHTML += "<p> Hunter owned by " + snapshot.child("owner").val() + "</p>";

						break;

						case "bd": 

							document.getElementById(targetId).innerHTML += "<p> Bodyguard owned by " + snapshot.child("owner").val() + "</p>";

						break;

						case "tr": 

							document.getElementById(targetId).innerHTML += "<p> Tender owned by " + snapshot.child("owner").val() + "</p>";

						break;

						case "mr": 

							document.getElementById(targetId).innerHTML += "<p> Messenger owned by " + snapshot.child("owner").val() + "</p>";

						break;

						case "ir": 

							document.getElementById(targetId).innerHTML += "<p> Investigator owned by " + snapshot.child("owner").val() + "</p>";

						break;

					}

				});

				intActionPointsRemaining -= 2;
				funcActionFeedback(0);
				
			} else {

				funcActionFeedback(1);

			}

		break;

	}

}

// Type 0: OK
// Type 1: Not engough action points
// Type 2: Invalid action

function funcActionFeedback(type) {

	switch (type) {

		case 0: 

			intActionPhase = 0;

		break;

		case 1: 

			alert("you don't have enough action points");

		break;

	}

}