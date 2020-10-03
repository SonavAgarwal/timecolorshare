
// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyAQQ6ij5MtFJnWeONYLvewpq6g25STTNdU",
authDomain: "timecolorshare.firebaseapp.com",
databaseURL: "https://timecolorshare.firebaseio.com",
projectId: "timecolorshare",
storageBucket: "timecolorshare.appspot.com",
messagingSenderId: "772894226718",
appId: "1:772894226718:web:60b0d4f0c39848593f310f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function signUpUser() {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}