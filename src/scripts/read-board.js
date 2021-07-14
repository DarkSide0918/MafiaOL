var fileInput = document.getElementById("input-board-file-upload");

fileInput.addEventListener("change", function() {

	readXlsxFile(fileInput.files[0]).then(function(data) {

		for (var i = 1; i < data.length; i++) {
				
			firebase.database().ref("rooms/" + myRoomName + "/characters/" + i).update({

				n: data[i][0],
				d: data[i][1],
				o: data[i][2],
				f: data[i][3],
				r: data[i][4],
				s: "n"		

			});

		}

	});

});