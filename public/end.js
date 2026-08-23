// public/end.js
// Updated to initialize Firebase and save high scores to Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1R9btd3eWN3M_xrmJ6K1-ye4EtcDScyY",
  authDomain: "first-74301.firebaseapp.com",
  databaseURL: "https://first-74301-default-rtdb.firebaseio.com",
  projectId: "first-74301",
  storageBucket: "first-74301.appspot.com",
  messagingSenderId: "9783048559",
  appId: "1:9783048559:web:2fd169534323a559da909a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore') || 0;
const realName = localStorage.getItem('userRealName') || '';

finalScore.innerText = mostRecentScore;

// Guard: only allow saving when user is signed in or we have a local name
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

const saveHighScore = async (e) => {
  e.preventDefault();
  if (!saveScoreBtn) return;
  saveScoreBtn.disabled = true;

  const userName = currentUser?.displayName || realName || 'Anonymous';
  const scoreValue = Number(mostRecentScore) || 0;

  const dbRef = ref(database, 'highScoreStore');
  const scoreObj = {
    score: scoreValue,
    userName,
    timestamp: Date.now()
  };

  try {
    await push(dbRef, scoreObj);
    console.log('Saved to firebase:', scoreObj);
    // Optionally keep a local copy (unchanged behavior)
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ score: scoreValue, userName });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Feedback and navigate to highscore page
    alert('Score saved successfully!');
    window.location.href = 'highscore.html';
  } catch (err) {
    console.error('Error saving score to firebase', err);
    alert('Failed to save score. See console for details.');
    saveScoreBtn.disabled = false;
  }
};

if (saveScoreBtn) {
  saveScoreBtn.addEventListener('click', saveHighScore);
}

const audio = new Audio('close.mp3');
audio.loop = true;
audio.play();
