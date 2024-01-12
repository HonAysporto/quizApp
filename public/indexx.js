
const gameBtn = document.getElementById('gameBtn');
const highScoreBtn = document.getElementById('highScoreBtn');

    const audio = new Audio("let'start.mp3");
audio.loop = true;
audio.play();



document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();

        var focusedButton = document.activeElement;

        if (event.key === 'ArrowUp') {
            if (focusedButton === gameBtn) {
                highScoreBtn.focus();
            } else {
                gameBtn.focus();
            }
        } else if (event.key === 'ArrowDown') {
            if (focusedButton === highScoreBtn) {
                gameBtn.focus();
            } else {
                highScoreBtn.focus();
            }
        }
    }
});


