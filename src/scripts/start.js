// Cached Local Credentials
var loggedIn = false;
var manualLogin = false;
var autoLogin = false;
var userEmail = "";
var userPassword = "";
var userName = "";

// Cached Local Game Data
var intActionsRemaining = 0;
var intActionPhase = 0;
var strSelectedChr = "";
var strSelectedAction = "";
var strSelectedTarget = "";

// Cached Local Misc
var myRoomName = "";

function reset() {

	myRoomName = null;

}