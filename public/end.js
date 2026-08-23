
// public/end.js
// Firebase initialization + authenticated high-score saving

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  push
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyC1R9btd3eWN3M_xrmJ6K1-ye4EtcDScyY",
  authDomain: "first-74301.firebaseapp.com",
  databaseURL: "https://first-74301-default-rtdb.firebaseio.com",
  projectId: "first-74301",
  storageBucket: "first-74301.appspot.com",
  messagingSenderId: "9783048559",
  appId: "1:9783048559:web:2fd169534323a559da909a"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");


// =====================================================
// GET SCORE AND USER INFORMATION
// =====================================================

const mostRecentScore =
  localStorage.getItem("mostRecentScore") || 0;

const realName =
  localStorage.getItem("userRealName") || "";


// Display final score
if (finalScore) {
  finalScore.innerText = mostRecentScore;
}


// =====================================================
// FIREBASE AUTHENTICATION STATE
// =====================================================

let currentUser = null;
let authReady = false;


// Wait for Firebase to determine whether the user
// is logged in or not.

onAuthStateChanged(auth, (user) => {

  currentUser = user;
  authReady = true;

  if (user) {

    console.log("Firebase user authenticated:", {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email
    });

  } else {

    console.log("No Firebase user is currently logged in.");

  }

});


// =====================================================
// SAVE HIGH SCORE
// =====================================================

const saveHighScore = async (e) => {

  e.preventDefault();

  if (!saveScoreBtn) {
    return;
  }

  // Prevent multiple clicks
  saveScoreBtn.disabled = true;


  // ---------------------------------------------------
  // Make sure Firebase has finished checking auth
  // ---------------------------------------------------

  if (!authReady) {

    alert("Please wait a moment and try again.");

    saveScoreBtn.disabled = false;

    return;
  }


  // ---------------------------------------------------
  // Make sure the user is logged in
  // ---------------------------------------------------

  if (!currentUser) {

    alert("You must log in with Google before saving your score.");

    saveScoreBtn.disabled = false;

    return;
  }


  // ---------------------------------------------------
  // Get user information
  // ---------------------------------------------------

  const userName =
    currentUser.displayName ||
    realName ||
    "Anonymous";

  const userEmail =
    currentUser.email || "";

  const userId =
    currentUser.uid;


  // ---------------------------------------------------
  // Get score
  // ---------------------------------------------------

  const scoreValue =
    Number(mostRecentScore) || 0;


  // ---------------------------------------------------
  // Firebase database reference
  // ---------------------------------------------------

  const dbRef =
    ref(database, "highScoreStore");


  // ---------------------------------------------------
  // Score object
  // ---------------------------------------------------

  const scoreObj = {

    score: scoreValue,

    userName: userName,

    userId: userId,

    userEmail: userEmail,

    timestamp: Date.now()

  };


  // ===================================================
  // SAVE SCORE TO FIREBASE
  // ===================================================

  try {

    const newScoreRef =
      await push(dbRef, scoreObj);


    console.log(
      "Score successfully saved to Firebase:",
      scoreObj
    );

    console.log(
      "Firebase score ID:",
      newScoreRef.key
    );


    // =================================================
    // SAVE LOCAL COPY
    // =================================================

    const highScores =
      JSON.parse(
        localStorage.getItem("highScores")
      ) || [];


    highScores.push({

      score: scoreValue,

      userName: userName

    });


    // Sort highest score first

    highScores.sort(
      (a, b) => b.score - a.score
    );


    // Keep only top 5 locally

    highScores.splice(5);


    localStorage.setItem(
      "highScores",
      JSON.stringify(highScores)
    );


    // =================================================
    // SUCCESS
    // =================================================

    alert("Score saved successfully!");

    window.location.href =
      "highscore.html";


  } catch (err) {

    console.error(
      "Error saving score to Firebase:",
      err
    );


    // More useful error messages

    if (err.code === "PERMISSION_DENIED") {

      alert(
        "Firebase denied permission to save your score. " +
        "Make sure you are logged in and your Realtime Database rules allow authenticated users."
      );

    } else {

      alert(
        "Failed to save your score. Please try again."
      );

    }


    saveScoreBtn.disabled = false;

  }

};


// =====================================================
// SAVE BUTTON EVENT
// =====================================================

if (saveScoreBtn) {

  saveScoreBtn.addEventListener(
    "click",
    saveHighScore
  );

}


// =====================================================
// BACKGROUND AUDIO
// =====================================================

const audio =
  new Audio("close.mp3");

audio.loop = true;


// Some browsers block autoplay.
// We catch the error so it doesn't create
// an unnecessary console error.

audio.play().catch((error) => {

  console.log(
    "Audio autoplay was blocked by the browser.",
    error
  );

});
```
