var sendDelay = 0;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.uid);
        console.log(user.email);

        if (user.emailVerified) {
            window.location.href = "/home.html";
        } else {
            sendEmail();
        }
    } else {
        window.location.href = "/signin.html"
    }
});

function checkVerified() {
    firebase.auth().currentUser.reload();
    setTimeout(function () {
        if (firebase.auth().currentUser.emailVerified) {
            window.location.href = "/home.html";
            
        } 
        else {
            var verifyError = document.getElementById("proceedError");
            verifyError.innerHTML = "your email is not verified";
            verifyError.style.display = "block";
        }
    }, 250);
}

function sendEmail() {
    var sendError = document.getElementById("sendError");
    if (sendDelay != 0) {
        sendError.innerHTML = "please wait before trying that again";
        sendError.style.display = "block";
        return
    }
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        sendDelay = 1;
        window.setTimeout(function(){
            sendDelay = 0;
            document.getElementById("sendError").style.display = "none";
        }, 1000 * 30);
        console.log("sent");
    }).catch(function(error) {
        // An error happened.
    });
}