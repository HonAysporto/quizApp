const userName = document.getElementById('username')
const saveScoreBtn = document.getElementById('saveScoreBtn')
const finalScore = document.getElementById('finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore');


 const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
 const realName = localStorage.getItem('userRealName')

 const MAX_HIGH_SCORES = 5;
finalScore.innerText = mostRecentScore;
// console.log(mostRecentScore);



// userName.addEventListener('keyup', () => {
//     console.log(userName.value);
//     this one take time 😒
//     saveScoreBtn.disabled = !userName.value 
// })

const saveHighScore = e => {
    console.log('clicked the save button');
e.preventDefault()

const score = {
    score: mostRecentScore,
    // score: Math.floor(Math.random() * 100),
    realName
};


highScores.push(score);
highScores.sort((a,b) => b.score - a.score)
highScores.splice(5);

localStorage.setItem('highScores', JSON.stringify(highScores));
console.log(highScores);
// window.location.href = 'indexx.html';
}

const audio = new Audio("close.mp3");
audio.loop = true;
audio.play();




