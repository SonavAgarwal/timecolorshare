const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const clockEmail = urlParams.get('clockEmail');
// console.log(clockEmail);

var clockHostUID;

var controlButton = document.getElementById("clockControl");
var colorSlider = document.getElementById("colorInput");

var clockTime = new Date();
var today = new Date();

var clockInterval;

var roomData;

var db = firebase.firestore();

var colors = [
    [255, 255, 255],
    [255, 29, 29],
    [255, 255, 63],
    [21, 115, 255]
];


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        if (!user.emailVerified) {
            window.location.href = "/emailVerify.html";
            return;
		}
		
		document.getElementById("roomName").innerHTML = "personal";

		if (clockEmail == null) {
			// console.log("1")
			clockHostUID = firebase.auth().currentUser.uid;
		} else if (clockEmail == firebase.auth().currentUser.email) {
			// console.log("3")
			clockHostUID = firebase.auth().currentUser.uid;
		} else {
			// console.log("2")
			db.collection("emailToUID").doc(normalizeEmail(clockEmail)).get().then(function(doc) {
				clockHostUID = doc.data().uid;
			});
		}

        
        startClock();
    } else {
        // No user is signed in.
    }
});

function startClock() {
	// console.log("nothere")
	if (clockHostUID == null) {
		window.setTimeout(startClock, 300);
		return;
	}
	// console.log("mmeeeep")
	// console.log(clockHostUID);
    db.collection('users').doc(clockHostUID).collection("rooms").doc("personal").onSnapshot(
		doc => {
			// console.log("overhere")
			roomData = doc.data();
			renderRoom();
		},
		error => {
			// console.log(error)
			document.getElementById("noAccess").style.display = "block";
			window.setTimeout(function() {
				window.location.href = "/home.html";
			}, 3000);
		}        
    );
}

function renderRoom() {
    roomData = roomData;
    displayColor();
	displayButtons();
	
	if (roomData.reset) {
        setClockTime("00:00 0");
        return;
    }

    if (roomData.running) {
        renderTime();
        window.clearInterval(clockInterval);
        clockInterval = window.setInterval(renderTime, 100);
    } else {
        window.clearInterval(clockInterval);
    }

}

function displayButtons() {
    if (!roomData.running) {
        clockControl.innerHTML = "Start"
        document.getElementById("resetButton").style.display = "block";
    } else {
        clockControl.innerHTML = "Stop";
        document.getElementById("resetButton").style.display = "none";
    }
}

function renderTime() {

    today = new Date();
    var started = new Date(roomData.startTime);
    var ms = (today - started) + roomData.timeDifference;
    setClockTime(msToTime(ms));
}

function setClockTime(str) {
    var newStr = str.split(" ")
    document.getElementById("clockTime").innerHTML = newStr[0] + "<span id = 'ms'>" + newStr[1] + "</span>";
    document.getElementById("clockTime").style.fontSize = (120 / newStr[0].length) + 'vw';
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (hours == 0) return minutes + ":" + seconds + " " + milliseconds ;
    return hours + ":" + minutes + ":" + seconds + " " + milliseconds ;
}

function handleClockClick() {
    if (roomData.running) {
        db.collection('users').doc(clockHostUID).collection("rooms").doc("personal").set({
            running: false,
            timeDifference: roomData.timeDifference + (new Date() - new Date(roomData.startTime)),
            startTime: new Date() + "",
            reset: false
        }, {
            merge: true
        });
    } else {
        db.collection('users').doc(clockHostUID).collection("rooms").doc("personal").set({
            running: true,
            startTime: new Date() + "",
            reset: false
        }, {
            merge: true
        });
    }
}

function reset() {
    db.collection('users').doc(clockHostUID).collection("rooms").doc("personal").set({
        running: false,
        startTime: new Date() + "",
        timeDifference: 0,
        reset: true
    }, {
        merge: true
    }).then(function() {
        setClockTime("00:00 0");
    });
}

function updateColor() {
    if (roomData.color == colorSlider.value) return;
    db.collection('users').doc(clockHostUID).collection("rooms").doc("personal").set({
        color: colorSlider.value
    }, {
        merge: true
    });
}

function displayColor() {

    colorSlider.value = roomData.color;

    var startColors;
    var endColors;
    var resultColors = [0, 0, 0];

    if (colorSlider.value <= 100) {
        startColors = colors[0];
        endColors = colors[1];

    } else if (colorSlider.value <= 200) {
        startColors = colors[1];
        endColors = colors[2];


    } else if (colorSlider.value <= 300) {
        startColors = colors[2];
        endColors = colors[3];


    } else {
        startColors = colors[3];
        endColors = colors[1];
    }

    for (var i = 0; i < 3; i++) {
        resultColors[i] = limitColor(startColors[i] + ((endColors[i] - startColors[i]) * ((colorSlider.value % 100) / 100)));
    }


    document.body.style.backgroundColor = "rgb(" + resultColors[0] + ", " + resultColors[1] + ", " + resultColors[2] + ")";
}

function limitColor(n) {
    if (n < 0) return 0;
    if (n > 255) return 255;
    return n;
}