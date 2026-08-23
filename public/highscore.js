import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  onValue
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




const highScoreList =
  document.getElementById("highScoreList");

const loading =
  document.getElementById("loading");

const emptyMessage =
  document.getElementById("emptyMessage");

const playerCount =
  document.getElementById("playerCount");




function loadHighScores() {

  const dbRef =
    ref(database, "highScoreStore");


  onValue(
    dbRef,

    (snapshot) => {

      // Hide loading message
      if (loading) {
        loading.style.display = "none";
      }


      // Clear previous scores
      highScoreList.innerHTML = "";


      // No scores
      if (!snapshot.exists()) {

        if (emptyMessage) {
          emptyMessage.style.display = "block";
        }

        if (playerCount) {
          playerCount.textContent = "0 Players";
        }

        return;
      }


      // Hide empty message
      if (emptyMessage) {
        emptyMessage.style.display = "none";
      }



      const scores = [];

      snapshot.forEach((childSnapshot) => {

        const scoreData =
          childSnapshot.val();

        scores.push({

          id: childSnapshot.key,

          userName:
            scoreData.userName ||
            "Anonymous",

          score:
            Number(scoreData.score) || 0,

          timestamp:
            scoreData.timestamp || 0,

          userId:
            scoreData.userId || ""

        });

      });



      scores.sort((a, b) => {

        if (b.score !== a.score) {
          return b.score - a.score;
        }



        return b.timestamp - a.timestamp;

      });




      if (playerCount) {

        playerCount.textContent =
          `${scores.length} ${
            scores.length === 1
              ? "Player"
              : "Players"
          }`;

      }


    

      scores.forEach((player, index) => {

        const position =
          index + 1;


        const scoreItem =
          document.createElement("li");

        scoreItem.classList.add(
          "score-item"
        );


        // Add special class to top 3

        if (position === 1) {

          scoreItem.classList.add(
            "first-place"
          );

        } else if (position === 2) {

          scoreItem.classList.add(
            "second-place"
          );

        } else if (position === 3) {

          scoreItem.classList.add(
            "third-place"
          );

        }



        let rankDisplay;

        if (position === 1) {

          rankDisplay = "🥇";

        } else if (position === 2) {

          rankDisplay = "🥈";

        } else if (position === 3) {

          rankDisplay = "🥉";

        } else {

          rankDisplay = position;

        }




        const rank =
          document.createElement("div");

        rank.classList.add("rank");

        rank.textContent =
          rankDisplay;


  

        const playerInfo =
          document.createElement("div");

        playerInfo.classList.add(
          "player-info"
        );


        const avatar =
          document.createElement("div");

        avatar.classList.add(
          "player-avatar"
        );


        // Get first letter of username

        avatar.textContent =
          player.userName
            .charAt(0)
            .toUpperCase();


        const name =
          document.createElement("div");

        name.classList.add(
          "player-name"
        );

        name.textContent =
          player.userName;


        playerInfo.appendChild(avatar);
        playerInfo.appendChild(name);


        

        const score =
          document.createElement("div");

        score.classList.add(
          "score-value"
        );

        score.innerHTML = `
          <span>${player.score}</span>
          <small>PTS</small>
        `;


   

        scoreItem.appendChild(rank);
        scoreItem.appendChild(playerInfo);
        scoreItem.appendChild(score);

        highScoreList.appendChild(
          scoreItem
        );

      });

    },




    (error) => {

      console.error(
        "Error loading scores:",
        error
      );

      if (loading) {

        loading.textContent =
          "Unable to load scores.";

      }

    }

  );

}




onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "Authenticated user:",
        user.displayName
      );

      loadHighScores();

    } else {

      console.log(
        "No authenticated user."
      );

      if (loading) {

        loading.textContent =
          "Please log in to view the leaderboard.";

      }

    }

  }
);



const audio =
  new Audio("highscore.mp3");

audio.loop = true;




audio.play().catch(() => {

  console.log(
    "Background music requires user interaction."
  );

});
