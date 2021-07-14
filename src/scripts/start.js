// Cached Local Credentials
var loggedIn = false;
var manualLogin = false;
var autoLogin = false;
var userEmail = "";
var userPassword = "";
var userName = "";

// Cached Local Game Data
var intActionPointCapacity = 10;
var intActionPointsRemaining = 0;
var intActionPhase = 0;
var strSelectedChr = "";
var strSelectedAction = "";
var strSelectedTarget = "";

// Cached Local Misc
var boolIsHost = false;
var myRoomName = "";

function reset() {

	boolIsHost = false;
	myRoomName = "";

}