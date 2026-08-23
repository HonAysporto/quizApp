
// public/end.js


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




const firebaseConfig = {
  apiKey: "AIzaSyC1R9btd3eWN3M_xrmJ6K1-ye4EtcDScyY",
  authDomain: "first-74301.firebaseapp.com",
  databaseURL: "https://first-74301-default-rtdb.firebaseio.com",
  projectId: "first-74301",
  storageBucket: "first-74301.appspot.com",
  messagingSenderId: "9783048559",
  appId: "1:9783048559:web:2fd169534323a559da909a"
};




const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);




const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");




const mostRecentScore =
  localStorage.getItem("mostRecentScore") || 0;

const realName =
  localStorage.getItem("userRealName") || "";


// Display final score
if (finalScore) {
  finalScore.innerText = mostRecentScore;
}




let currentUser = null;
let authReady = false;




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




const saveHighScore = async (e) => {

  e.preventDefault();

  if (!saveScoreBtn) {
    return;
  }

  // Prevent multiple clicks
  saveScoreBtn.disabled = true;



  if (!authReady) {

    alert("Please wait a moment and try again.");

    saveScoreBtn.disabled = false;

    return;
  }




  if (!currentUser) {

    alert("You must log in with Google before saving your score.");

    saveScoreBtn.disabled = false;

    return;
  }




  const userName =
    currentUser.displayName ||
    realName ||
    "Anonymous";

  const userEmail =
    currentUser.email || "";

  const userId =
    currentUser.uid;


  const scoreValue =
    Number(mostRecentScore) || 0;




  const dbRef =
    ref(database, "highScoreStore");




  const scoreObj = {

    score: scoreValue,

    userName: userName,

    userId: userId,

    userEmail: userEmail,

    timestamp: Date.now()

  };


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




    const highScores =
      JSON.parse(
        localStorage.getItem("highScores")
      ) || [];


    highScores.push({

      score: scoreValue,

      userName: userName

    });




    highScores.sort(
      (a, b) => b.score - a.score
    );



    highScores.splice(5);


    localStorage.setItem(
      "highScores",
      JSON.stringify(highScores)
    );


   

    alert("Score saved successfully!");

    window.location.href =
      "highscore.html";


  } catch (err) {

    console.error(
      "Error saving score to Firebase:",
      err
    );




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



if (saveScoreBtn) {

  saveScoreBtn.addEventListener(
    "click",
    saveHighScore
  );

}




const audio =
  new Audio("close.mp3");

audio.loop = true;



audio.play().catch((error) => {

  console.log(
    "Audio autoplay was blocked by the browser.",
    error
  );

});
```
