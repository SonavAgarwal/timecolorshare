
if (!window.matchMedia('(display-mode: standalone)').matches) {  
    document.getElementById("installPrompt").style.display = "block";
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // console.log(user.uid);
        // console.log(user.email);

        if (!user.emailVerified) window.location.href = "/emailVerify.html";
        
    } else {
        window.location.href = "/signIn.html";
    }
});

function joinRoom() {
    var hostEmail = normalizeEmail(document.getElementById("hostEmailInput").value);
    // var roomName = document.getElementById("roomNameInput").value;
    
    window.location.href = "/clock.html?clockEmail=" + hostEmail/* + "&roomName=" + roomName*/;
}

function openMyRoom() {

    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("rooms").doc("personal").set({
        name: [],
        running: true,
        color: 1,
        startTime: new Date() + "",
        timeDifference: 0,
        reset: false,
        partners: [normalizeEmail(document.getElementById("partnerEmailInput").value)]
    })
    .then(function() {
        window.location.href = "/clock.html";
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    
}