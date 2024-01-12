const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
const audio2 = new Audio("correct.mp3");
const audio3 = new Audio("lose.mp3");
let questions = [];

fetch(
    // 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
   'https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple'
// 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple'
// 'https://opentdb.com/api.php?amount=50&category=15&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        console.log(loadedQuestions);
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error('anytype of error');
    });

//CONSTANTS
const CORRECT_BONUS = 100;
const MAX_QUESTIONS = 2;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];

    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            
            audio2.play()
        } else {
            audio3.play()
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 3000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};



// let's play


// const buttons = [
//     document.getElementById('button1'),
//     document.getElementById('button2'),
//     document.getElementById('button3'),
//     document.getElementById('button4')
// ];






//  document.addEventListener('keydown', function(event) {
    
//     if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
       
//         event.preventDefault();

        
//         var focusedButton = document.activeElement;

       

//         if (event.key === 'ArrowUp') {
//             gameBtn.focus();
//         } else if (event.key === 'ArrowDown') {
//             highScoreBtn.focus();
//         }
//     }
// });








// document.addEventListener('keydown', function(event) {
//     if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
//         event.preventDefault();

//         const focusedButton = document.activeElement;

//         const index = buttons.indexOf(focusedButton);

//         if (event.key === 'ArrowUp') {
//             const newIndex = (index - 1 + buttons.length) % buttons.length;
//             buttons[newIndex].focus();
//         } else if (event.key === 'ArrowDown') {
//             const newIndex = (index + 1) % buttons.length;
//             buttons[newIndex].focus();
//         }
//     }
// });



//Audio

const audio = new Audio("suspence.mp3");
audio.loop = true;
audio.play()
