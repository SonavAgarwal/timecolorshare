
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.uid);
      console.log(user.email);
      window.location.href = "/home.html";
    } else {
      // No user is signed in.
    }
});

function signInUser() {

    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        window.location.href = "/home.html";

    }).catch(function(error) {
        document.getElementById("errorText").innerHTML = "please try again";
        document.getElementById("errorText").style.display = "block";
    });
}