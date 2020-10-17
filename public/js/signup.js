
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    //   console.log(user.uid);
    //   console.log(user.email);
    //   window.location.href = "/home.html";
    } else {
      // No user is signed in.
    }
});

function signUpUser() {

    var error = document.getElementById("errorText");

    var email = normalizeEmail(document.getElementById("emailInput").value);
    var password = document.getElementById("passwordInput").value;
    var userName = document.getElementById("nameInput").value;

    if (email == "" || password == "" || userName == "") {
        error.innerHTML = "fill in all fields"
        error.style.display = "block";
        return;
    }

    if (password.length < 8) {
        error.innerHTML = "password must be 8 characters or longer"
        error.style.display = "block";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        error.innerHTML = "include a proper email"
        error.style.display = "block";
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        // console.log("success");

        firebase.auth().currentUser.updateProfile({
            displayName: userName
        }).then(function() {
            // console.log("updated")
        }).catch(function(errorMsg) {
            console.log(errorMsg);
        });

        var db = firebase.firestore();
        db.collection("emailToUID").doc(firebase.auth().currentUser.email).set({
            uid: firebase.auth().currentUser.uid
        }).then(function(){
            // console.log("Suuuuccess");
            window.location.href = "/emailVerify.html";
        }).catch(function(errormeme) {
            // console.log(errormeme);
        });

        

    }).catch(function(errorMsg) {

        console.log(errorMsg);
        // Handle Errors here.
        var errorCode = errorMsg.code;
        var errorMessage = errorMsg.message;
        // ...
    });
}