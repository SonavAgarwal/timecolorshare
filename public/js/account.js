firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("emailDisplay").innerHTML = user.email;
        document.getElementById("nameDisplay").innerHTML = user.displayName;
    } else {
        window.location.href = "/signin.html"
    }
});

function changePassword() {

    var error = document.getElementById("errorText");
    var password = document.getElementById("passwordInput").value;

    if (password == "") {
        error.innerHTML = "fill in all fields"
        error.style.display = "block";
        return;
    }

    if (password.length < 10) {
        error.innerHTML = "password must be longer"
        error.style.display = "block";
        return;
    }

    firebase.auth().currentUser.updatePassword(password).then(function() {
        console.log("success");
        window.location.href = "/home.html";
    }).catch(function(errorMsg) {
        console.log(errorMsg);
    })
}

function changeName() {
    var userName = document.getElementById("nameInput").value;
    firebase.auth().currentUser.updateProfile({
        displayName: userName
    }).then(function() {
        console.log("updated");
        window.location.href = "/home.html";
    }).catch(function(errorMsg) {
        console.log(errorMsg);
    });
}


function signOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}