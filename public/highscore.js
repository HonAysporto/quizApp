// const highScoresList = document.getElementById("highScoresList");
// const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// // console.log(highScores);
// highScoresList.innerHTML = highScores
//   .map(score => {
//     return `<li class="high-score">${score.realName} - ${score.score}</li>`;
//   })
//   .join("");

  const audio = new Audio("highscore.mp3");
  audio.loop = true;
  audio.play();


  

