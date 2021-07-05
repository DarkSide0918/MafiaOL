function refreshRoomList() {

	document.getElementById("room-items-container").innerHTML = "";

	firebase.database().ref("rooms").once("value", function (snapshot) {

		var roomKeys = Object.keys(snapshot.val());

		for (i = 0; i < roomKeys.length; i++) {

			var html = "";

			html += "<div class='room-item' id='room-" + roomKeys[i] + "' onclick='joinRoom(`" + roomKeys[i] + "`)'>";
			html += "<div class='room-item-content-container'>";
			html += "<img class='room-item-preview-image'> </img>";
			html += "<div class='room-title-and-description-container'>";

			html += "<p class='room-title-text'> " + snapshot.child(roomKeys[i]).child("roomName").val() + " </p>";
			html += "<p class='room-description-text'> </p>";

			html += "</div>";

			html += "<p class='game-mode-text'> </p>"
			html += "<p class='player-count-text'> </p>"

			html += "</div>";
			html += "</div>";

			document.getElementById("room-items-container").innerHTML += html;

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

		firebase.database().ref("rooms/" + myRoomName + "/connected").update({

			[userName]: false

		});

		refreshPlayerList();

	});

}

function createRoom() {

	var roomName = document.getElementById("room-name-input").value;
	var roomPassword = document.getElementById("room-password-input").value;

	// Detect if either field is empty
	if (roomName != "" && roomPassword != "") {

		//Detect if name is already taken
		firebase.database().ref("rooms/" + roomName).once("value").then( function (snapshot) {

			if (snapshot.exists()) {

				alert("This Room Already Exists");

				return false;

			} else {

				firebase.database().ref("rooms/" + roomName).set({

					"roomName": roomName,
					"roomPassword": roomPassword

				});

				joinRoom(roomName);

			}

		});

	}

	return false;

}

function leaveRoom() {

	firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).remove();

	switchScenes("home");

}

function refreshPlayerList() {

	document.getElementById("room-connected-players-list").innerHTML = "";

	firebase.database().ref("rooms/" + myRoomName + "/connected").once("value", (snapshot) => {

		var playerKeys = Object.keys(snapshot.val());

		for (i = 0; i < playerKeys.length; i++) {

			var html = "";

			html += "<div class='player-list-item'>"

			if (snapshot.child(playerKeys[i]).val()) {

				html += "<p> " + playerKeys[i] + " ✓ </p>"

			} else {

				html += "<p> " + playerKeys[i] + " </p>"

			}

			html += "</div>"

			document.getElementById("room-connected-players-list").innerHTML += html;

		}

	});

}

function ready() {

	firebase.database().ref("rooms/" + myRoomName + "/connected/" + userName).once("value", (snapshot) => {

		if (snapshot.val() == true) {

			firebase.database().ref("rooms/" + myRoomName + "/connected").update({

				[userName]: false

			});

		} else {

			firebase.database().ref("rooms/" + myRoomName + "/connected").update({

				[userName]: true

			});

		}

	});


}