import { auth, signInWithEmailAndPassword,onAuthStateChanged } from "./config.js";


// Get the forms and the message element
const loginForm = document.querySelector('.login-form');


// Event listener for the login form
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the form inputs
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            location.href = "./user.html";

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(`Error: ${errorMessage}`);
            console.log(`Error: ${errorCode}, Message: ${errorMessage}`);
        });


});

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      location.href = "./user.html";

      // ...
    } else {
      // User is signed out
      // ...

    }
  });

