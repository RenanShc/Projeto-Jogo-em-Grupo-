const difficultyButtons = document.querySelectorAll('.dificuldade button');
const playButton = document.querySelector('.bootes > button');
const defaultDifficulty = localStorage.getItem('gameDifficulty') || 'facil';

function setDifficulty(level) {
    localStorage.setItem('gameDifficulty', level);
    difficultyButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.diff === level);
    });
}

difficultyButtons.forEach((button) => {
    button.addEventListener('click', () => setDifficulty(button.dataset.diff));
});

playButton.addEventListener('click', () => {
    if (!localStorage.getItem('gameDifficulty')) {
        setDifficulty(defaultDifficulty);
    }
    window.location.href = 'index.html';
});

setDifficulty(defaultDifficulty);
