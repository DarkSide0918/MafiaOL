function refreshRoomList() {

	// TODO: Better Database Efficiency (New branch roomlist)

	document.getElementById("room-items-container").innerHTML = "";

	firebase.database().ref("rooms").once("value", function (snapshot) {

		if (snapshot.val() != null) {

			var roomKeys = Object.keys(snapshot.val());

			for (i = 0; i < roomKeys.length; i++) {

				var html = "";

				html += "<div class='room-item' id='room-" + roomKeys[i] + "' onclick='joinRoom(`" + roomKeys[i] + "`)'>";
				html += "<div class='room-item-content-container'>";
				// html += "<img class='room-item-preview-image' src='assets/images/forest1.png'> </img>";
				html += "<div class='room-title-and-description-container'>";

				html += "<p class='room-title-text'> " + snapshot.child(roomKeys[i]).child("roomName").val() + " </p>";
				html += "<p class='room-description-text'> </p>";

				html += "</div>";

				html += "<p class='game-mode-text'> </p>";
				html += "<p class='player-count-text'> </p>";

				html += "</div>";
				html += "</div>";

				document.getElementById("room-items-container").innerHTML += html;

			}

		}

	});

}

function joinRoom(roomID) {

	var roomNameText = "";

	switchScenes("room");

	firebase.database().ref("rooms/" + roomID).once("value", (snapshot) => {

		roomNameText = snapshot.child("roomName").val();
		myRoomName = snapshot.child("roomName").val();

		document.getElementById("room-name").innerHTML = roomNameText;

		if (userName == snapshot.child("host").val()) {

			boolIsHost = true;

			firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).update({

				h: true,
				r: false
	
			});

			firebase.database().ref("rooms/" + myRoomName).update({

				"started": false
	
			});

		} else {

			firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).update({

				h: false,
				r: false
	
			});

		}

		refreshPlayerList();

		firebase.database().ref("rooms/" + roomID + "/started").on("value", (snapshot) => {

			if (snapshot.val()) {
	
				startGame();
	
			}
	
		});	

	});

}

function createRoom() {

	var roomName = document.getElementById("input-room-name").value;
	var roomPassword = document.getElementById("input-room-password").value;

	// Detect if either field is empty
	if (roomName != "" && roomPassword != "") {

		firebase.database().ref("accounts/" + userName + "/credits").once("value", (snapshot) => {

			intCreditsRemaining = snapshot.val();

			if (intCreditsRemaining >= 10) {

				//Detect if name is already taken
				firebase.database().ref("rooms/" + roomName).once("value").then( function (snapshot) {
	
					if (snapshot.exists()) {
	
						alert("This Room Already Exist.");
	
						return false;
	
					} else {
	
						firebase.database().ref("rooms/" + roomName).set({
	
							"roomName": roomName,
							"roomPassword": roomPassword,
							"host": userName,
							"started": false,
							"round": 0
	
						});
	
						joinRoom(roomName);
	
						intCreditsRemaining -= 10;
	
						firebase.database().ref("accounts/" + userName).update({
	
							"credits": intCreditsRemaining
	
						});
	
					}
	
				});
	
			}

		});

	}

	return false;

}

function leaveRoom() {

	firebase.database().ref("rooms/" + myRoomName + "/host").once("value", (snapshot) => {

		if (snapshot.val() == userName) {

			firebase.database().ref("rooms/" + myRoomName).remove();

		} else {

			firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).remove();

		}

		switchScenes("home");

		reset();

	});

}

function refreshPlayerList() {

	firebase.database().ref("rooms/" + myRoomName + "/connected").on("value", (snapshot) => {

		document.getElementById("room-connected-players-list").innerHTML = "";

		if (snapshot.val() != null) {

			var playerKeys = Object.keys(snapshot.val());

			var boolAllowStart = true;

			for (i = 0; i < playerKeys.length; i++) {

				var html = "";

				html += "<div class='player-list-item'>"

				if (snapshot.child(playerKeys[i]).child("h").val()) {

					html += "<p class='p-static-list-item'> " + playerKeys[i] + " <span class='span-tag-host'>Host</span>"

					if (snapshot.child(playerKeys[i]).val() == userName) {

						boolIsHost = true;

					}

				} else {

					html += "<p class='p-static-list-item'> " + playerKeys[i]

				}

				if (snapshot.child(playerKeys[i]).child("r").val()) {

					html += "<span class='span-tag-ready'>Ready</span> </p>"

				} else {

					html += "</p>"

					boolAllowStart = false;

				}

				html += "</div>"

				document.getElementById("room-connected-players-list").innerHTML += html;

				if (boolAllowStart && boolIsHost) {

					document.getElementById("start-game-button").hidden = false;

				} else {

					document.getElementById("start-game-button").hidden = true;

				}

			}

		}

	});

}

function ready() {

	firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName + "/r").once("value", (snapshot) => {

		if (snapshot.val()) {

			firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).update({

				"r": false

			});

		} else {

			firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).update({

				"r": true

			});

		}

	});


}

function clickStartGame() {

	firebase.database().ref("rooms/" + myRoomName).update({

		"started": true

	});

}

function startGame() {

	// Detach Event Listeners
	firebase.database().ref("rooms/" + myRoomName + "/connected").off();
	firebase.database().ref("rooms/" + myRoomName + "/started").off();

	switchScenes("game");

	syncGame();

}