function funcEndRound() {

    firebase.database().ref("rooms/" + myRoomName + "/characters").on("value", function (snapshot) {

        var arrCharacterKeys = Object.keys(snapshot.val());
        var round = 0;

        for (var i = 1; i <= arrCharacterKeys.length; i++) {

            switch (snapshot.child(i).child("status").val()) {

                case "b":
                case "t":

                    firebase.database().ref("rooms/" + myRoomName + "/characters/" + i).update({

                        status: "n"

                    });

                break;

                case "i":
                case "sa":

                    firebase.database().ref("rooms/" + myRoomName + "/characters/" + i).update({

                        status: "k"

                    });

                break;

                case "si":

                    firebase.database().ref("rooms/" + myRoomName + "/characters/" + i).update({

                        status: "i"

                    });

                break;

            }

        }

        firebase.database().ref("rooms/" + myRoomName).update({

            "round": round + 1

        });

    });

    firebase.database().ref("rooms/" + myRoomName + "/round").once("value", function(snapshot) {

        round = snapshot.val();

    });

}

function funcAbortGame() {

    firebase.database.ref("rooms/" + myRoomName + "/characters").remove();

}