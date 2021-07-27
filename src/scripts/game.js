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

					ownedCharacter += "<button class='owned-chr card owned-hr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`, `" + snapshot.child(i).child("n").val() + "`)'>";
					
					ownedCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val() + " <br> " + "Owned " + snapshot.child(i).child("r").val();
					ownedCharacter += "</button>";

				} else {

					otherCharacter += "<button class='card other-chr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`)'>";
					otherCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val();
					otherCharacter += "</button>";

				}

				document.getElementById("game-scene").innerHTML += ownedCharacter;
				document.getElementById("game-scene").innerHTML += otherCharacter;

			}

			firebase.database().ref("rooms/" + myRoomName + "/characters").off();

			funcClickCharacter(0, 0); 

		} else {

			var i = 0;
			var counts = 0;

			firebase.database().ref("rooms/" + myRoomName + "/counts").on("value", function (snapshot) {

				counts = snapshot.val()

			});

			firebase.database().ref("rooms/" + myRoomName + "/characters").off();
			firebase.database().ref("rooms/" + myRoomName + "/characters").on("child_added", function(snapshot) {

				var ownedCharacter = "";
				var otherCharacter = "";

				if (snapshot.child("o").val() == userName) {
					
					ownedCharacter += "<button class='owned-chr card owned-hr' id='" + snapshot.key + "' onclick='funcClickCharacter(" + snapshot.key + ", `" + snapshot.child("r").val() + "`, `" + snapshot.child("n").val() + "`)'>";
					ownedCharacter += snapshot.child("n").val() + " <br> " + snapshot.child("d").val() + " <br> " + "Owned " + snapshot.child("r").val();
					ownedCharacter += "</button>";

				} else {

					otherCharacter += "<button class='card other-chr' id='" + snapshot.key + "' onclick='funcClickCharacter(" + snapshot.key + ", `" + snapshot.child("r").val() + "`)'>";
					otherCharacter += snapshot.child("n").val() + " <br> " + snapshot.child("d").val();
					otherCharacter += "</button>";

				}

				document.getElementById("game-scene").innerHTML += ownedCharacter;
				document.getElementById("game-scene").innerHTML += otherCharacter;

				i ++;

				if (i == counts) {

					funcClickCharacter(0, 0); 
					firebase.database().ref("rooms/" + myRoomName + "/counts").off()

				}

			});

		}

		updateStats();

	});

	firebase.database().ref("game/characters").on("child_removed", function (snapshot) {

        document.getElementById(snapshot.key).remove();

		updateStats();
    
    });

	firebase.database().ref("rooms/" + myRoomName + "/round").on("value", function (snapshot) {

		intRound = snapshot.val();

		if (snapshot.val() <= intActionPointCapacity) {

			intActionPointsRemaining = snapshot.val();

		} else {

			intActionPointsRemaining = 10;

		}

		updateStats();

	});

	// Check if display host-exclusive buttons

	if (boolIsHost) {

		document.getElementById("input-board-file-upload").hidden = false;
		document.getElementById("button-end-round").hidden = false;
		document.getElementById("button-abort").hidden = false;

	} else {

		document.getElementById("input-board-file-upload").hidden = true;
		document.getElementById("button-end-round").hidden = true;
		document.getElementById("button-abort").hidden = true;

	}

}

function funcAwaitSyncGame() {



}

function funcDetachSyncGameListeners() {

	firebase.database().ref("rooms/" + myRoomName + "/characters").off();

}

function funcClickCharacter(chrId, chrRole, chrName) {

	switch (intActionPhase) {

		case 0:

			var arrOtherCharacters = document.getElementsByClassName("other-chr");
			var arrOwnedCharacters = document.getElementsByClassName("owned-chr");

			for (var i = 0; i < arrOtherCharacters.length; i++) {

				arrOtherCharacters[i].disabled = true;

			}

			for (var i = 0; i < arrOwnedCharacters.length; i++) {

				if (!arrOwnedCharacters[i].classList.contains("injured") && !arrOwnedCharacters[i].classList.contains("killed") && !arrOwnedCharacters[i].classList.contains("used")) {

					arrOwnedCharacters[i].disabled = false;

				}

			}

			intActionPhase = 1;

		break;

		case 1:

			funcSelectChr(chrRole, chrName);

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

			funcManageSelectButton();
			funcSelectTarget(chrId);

			intActionPhase = 0;
			funcClickCharacter(0, 0);

		break;

	}

	updateStats();

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
			document.getElementById("button-select-suicide").hidden = false;
			document.getElementById("input-messenger-field").hidden = false;
			document.getElementById("button-messenger-submit").hidden = false;

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

		console.log(strStatus)

		// Act

		switch (strSelectedAction) {

			case "assassinate":

				console.log("Step 1");

				if (intActionPointsRemaining >= 5 && strGameMode == "FFA" || intActionPointsRemaining >= 4 && strGameMode == "Team") {

					console.log("Step 2");
					console.log(strStatus);
					console.log(targetId);

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
						intActionPointsRemaining -= 5;
					else
						intActionPointsRemaining -= 4;

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

					firebase.database().ref("rooms/" + myRoomName + "/messages").push().set({

						// "t" = type, "s" = sender, "r" = receiver, "m" = message
						// Types: "s" = secret, "p" = public

						"t": "s",
						"s": strSelectedChrName,
						"r": targetId, //if class list contans owned-chr then display message
						"m": document.getElementById("input-messenger-field").value,


					});

					intActionPointsRemaining -= 1;
					funcActionFeedback(0);

				} else {

					funcActionFeedback(1);

				}

			break;

			case "investigate":

				if (intActionPointsRemaining >= 3) {

					firebase.database().ref("rooms/" + myRoomName + "/characters/" + targetId).once("value", function(snapshot) {

						switch (snapshot.child("r").val()) {

							case "an": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Assassin owned by " + snapshot.child("owner").val() + "</p>";

							break;

							case "hr": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Hunter owned by " + snapshot.child("owner").val() + "</p>";

							break;

							case "bd": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Bodyguard owned by " + snapshot.child("owner").val() + "</p>";

							break;

							case "tr": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Tender owned by " + snapshot.child("owner").val() + "</p>";

							break;

							case "mr": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Messenger owned by " + snapshot.child("owner").val() + "</p>";

							break;

							case "ir": 

								document.getElementById(targetId).innerHTML += "<p class='p-static-text'> Investigator owned by " + snapshot.child("owner").val() + "</p>";

							break;

						}

					});

					intActionPointsRemaining -= 3;
					funcActionFeedback(0);
					
				} else {

					funcActionFeedback(1);

				}

			break;

		}

	});

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

function updateStats() {

	document.getElementById("p-display-action-points").innerHTML = "Action Points: " + intActionPointsRemaining;
	document.getElementById("p-display-round").innerHTML = "Round: " + intRound;

}

function funcUpdateCharacterStatus() {

	firebase.database().ref("rooms/" + myRoomName + "/characters").once("value", function (snapshot) {

		var characterKeys = Object.keys(snapshot.val());

		for (var i = 0; i < characterKeys.length; i++) {

			var ownedCharacter = "";
			var otherCharacter = "";

			switch (snapshot.child(i).child("s").val()) {

				case "i":

					if (snapshot.child(i).child("o").val() == userName) {

						ownedCharacter += "<button class='owned-chr card owned-hr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`, `" + snapshot.child(i).child("n").val() + "`)'>";
						ownedCharacter += "Injured <br> " + snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val() + " <br> " + "Owned " + snapshot.child(i).child("r").val();
						ownedCharacter += "</button>";

						document.getElementById(i).innerHTML = ownedCharacter;
	
					} else {
	
						otherCharacter += "<button class='card other-chr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`)'>";
						otherCharacter += "Injured <br> " + snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val();
						otherCharacter += "</button>";

						document.getElementById(i).innerHTML = otherCharacter;
	
					}

					document.getElementById(i).classList.remove("killed");
					document.getElementById(i).classList.add("injured");

				break;

				case "k":

					if (snapshot.child(i).child("o").val() == userName) {

						ownedCharacter += "<button class='owned-chr card owned-hr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`, `" + snapshot.child(i).child("n").val() + "`)'>";
						ownedCharacter += "Dead <br> " + snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val() + " <br> " + "Owned " + snapshot.child(i).child("r").val();
						ownedCharacter += "</button>";

						document.getElementById(i).innerHTML = ownedCharacter;

						if (snapshot.child(i).child("r").val() == "an" || snapshot.child(i).child("r").val() == "hr"){

							switch (snapshot.child(i).child("r").val()) {

								case "an": 

									document.getElementById(i).classList.remove("owned-an");

								break;

								case "hr":

									document.getElementById(i).classList.remove("owned-hr");

								break;

							}

							if (document.getElementsByClassName("owned-an").length <= 0 && document.getElementsByClassName("owned-hr").length <= 0 && !boolIsHost) {

								alert("Defeat. ");
				
							}

						}
	
					} else {
	
						otherCharacter += "<button class='card other-chr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`)'>";
						otherCharacter += "Dead <br> " + snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val();
						otherCharacter += "</button>";

						document.getElementById(i).innerHTML = otherCharacter;
	
					}	

					document.getElementById(i).classList.remove("injured");
					document.getElementById(i).classList.add("killed");

				break;

				case "n":

					if (snapshot.child(i).child("o").val() == userName) {

						ownedCharacter += "<button class='owned-chr card owned-hr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`, `" + snapshot.child(i).child("n").val() + "`)'>";
						
						ownedCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val() + " <br> " + "Owned " + snapshot.child(i).child("r").val();
						ownedCharacter += "</button>";
	
					} else {
	
						otherCharacter += "<button class='card other-chr' id='" + i + "' onclick='funcClickCharacter(" + i + ", `" + snapshot.child(i).child("r").val() + "`)'>";
						otherCharacter += snapshot.child(i).child("n").val() + " <br> " + snapshot.child(i).child("d").val();
						otherCharacter += "</button>";
	
					}

					document.getElementById(i).classList.remove("injured");
					document.getElementById(i).classList.remove("killed");

				break;

			}

		}

	});

}