  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  import { getDatabase, ref, onValue,child,get,set,remove,update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA5t1PktgzqupC3VoCHox37foy9JDBDIME",
  databaseURL: "https://thechaibar-ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thechaibar-ca",
  storageBucket: "thechaibar-ca.appspot.com",
  messagingSenderId: "423899118248",
  appId: "1:423899118248:web:cb17e93864cd5db8e6209d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dbRef = ref(getDatabase());
  const db = getDatabase(app);


  export {auth,signInWithEmailAndPassword,onAuthStateChanged,
    dbRef, ref, onValue,child,get,set,db,remove,update,signOut }
