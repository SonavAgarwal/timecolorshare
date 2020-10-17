function normalizeEmail(email) {
    var returnEmail = email.toLowerCase();
    if (returnEmail.includes("@gmail.com")) {
        var tempUsername = returnEmail.substring(0, returnEmail.indexOf("@"));
        returnEmail = tempUsername.replace(".", "") + "@gmail.com";
    }

    returnEmail = returnEmail.toLowerCase().trim();

    return returnEmail;
}