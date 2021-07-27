// Constants
const cintCostAN = 5;
const cintCostHR = 3;
const cintCostBD = 2;
const cintCostTR = 5;
const cintCostMR = 1;
const cintCostIR = 3;

// Cached Local Credentials
var loggedIn = false;
var manualLogin = false;
var autoLogin = false;
var userEmail = "";
var userPassword = "";
var userName = "";
var intCreditsRemaining = 0;

// Cached Local Game Data
var intActionPointCapacity = 10;
var intActionPointsRemaining = 0;
var intActionPhase = 0;
var intRound = 0;
var strSelectedChr = "";
var strSelectedChrName = "";
var strSelectedAction = "";
var strSelectedTarget = "";

// Cached Local Misc
var boolIsHost = false;
var myRoomName = "";
var strGameMode = "FFA";

// Cached Local Game Pseudo-Constants
var intCostAN = 5;
var intCostHR = 3;
var intCostBD = 2;
var intCostTR = 3;
var intCostMR = 5;
var intCostIR = 5;

var boolUseWeightSystem = true;
var boolUseInjurySystem = true;
var boolUseSelectSystem = true;

function reset() {

	boolIsHost = false;
	myRoomName = "";

}