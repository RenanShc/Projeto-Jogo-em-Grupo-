const boardElement = document.getElementById('board');
const rollButton = document.getElementById('rollButton');
const positionElement = document.getElementById('position');
const diceValueElement = document.getElementById('diceValue');
const logElement = document.getElementById('log');
const questionCard = document.getElementById('questionCard');
const questionText = document.getElementById('questionText');
const answersElement = document.getElementById('answers');
const difficultyLabel = document.getElementById('difficultyLabel');

const difficulty = localStorage.getItem('gameDifficulty') || 'facil';
const boardSize = 25;
let position = 1;
let isWaitingAnswer = false;
let currentQuestion = null;

const questionSets = {
    facil: [
        {
            question: 'Qual destas ações ajuda a diminuir o lixo plástico?',
            answers: ['Usar sacolas reutilizáveis', 'Lavar plástico com água', 'Queimar o plástico'],
            correct: 0
        },
        {
            question: 'O que é melhor para o planeta?',
            answers: ['Reciclar', 'Descartar no chão', 'Enterrar sem separação'],
            correct: 0
        },
        {
            question: 'Plantar árvores ajuda a:',
            answers: ['Melhorar a qualidade do ar', 'Aumentar a poluição', 'Diminuir a água'],
            correct: 0
        }
    ],
    medio: [
        {
            question: 'Qual é uma fonte de energia renovável?',
            answers: ['Solar', 'Carvão', 'Óleo diesel'],
            correct: 0
        },
        {
            question: 'O que deve ser evitado para preservar rios?',
            answers: ['Jogar resíduos na água', 'Economizar água', 'Filtrar o esgoto'],
            correct: 0
        },
        {
            question: 'Qual hábito economiza mais água?',
            answers: ['Fechar a torneira ao escovar os dentes', 'Deixar a torneira aberta', 'Tomar banhos mais longos'],
            correct: 0
        }
    ],
    dificil: [
        {
            question: 'O desmatamento aumenta:',
            answers: ['Emissão de gases de efeito estufa', 'A biodiversidade', 'A quantidade de chuva'],
            correct: 0
        },
        {
            question: 'Qual ação é melhor para reduzir o consumo de energia?',
            answers: ['Desligar aparelhos quando não usados', 'Manter aparelhos em espera', 'Usar lâmpadas incandescentes'],
            correct: 0
        },
        {
            question: 'O que faz do transporte público uma escolha sustentável?',
            answers: ['Reduz emissões por pessoa', 'Aumenta o uso de carros', 'Gasta mais combustível'],
            correct: 0
        }
    ]
};

const specialSquares = {
    3: { type: 'rampa', move: 3, label: 'Energia solar' },
    6: { type: 'cobra', move: -2, label: 'Poluição' },
    9: { type: 'pergunta', label: 'Pergunta ambiental' },
    12: { type: 'rampa', move: 2, label: 'Reciclagem' },
    15: { type: 'cobra', move: -3, label: 'Lixo jogado' },
    18: { type: 'pergunta', label: 'Pergunta ambiental' },
    20: { type: 'rampa', move: 4, label: 'Transporte sustentável' },
    23: { type: 'cobra', move: -4, label: 'Desmatamento' }
};

function getRandomQuestion() {
    const set = questionSets[difficulty] || questionSets.facil;
    return set[Math.floor(Math.random() * set.length)];
}

function updateStatus(message) {
    logElement.textContent = message;
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let index = boardSize; index >= 1; index -= 1) {
        const square = document.createElement('div');
        square.className = 'board-square';
        square.dataset.square = index;

        const special = specialSquares[index];
        if (special) {
            square.classList.add(special.type);
            square.innerHTML = `<span class="square-label">${index}</span><small>${special.label}</small>`;
        } else {
            square.innerHTML = `<span class="square-label">${index}</span>`;
        }

        if (index === position) {
            const token = document.createElement('div');
            token.className = 'token';
            token.textContent = '🌱';
            square.appendChild(token);
        }

        boardElement.appendChild(square);
    }
}

function updateGameData() {
    positionElement.textContent = position;
    difficultyLabel.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function movePlayer(newPosition, message) {
    position = Math.max(1, Math.min(boardSize, newPosition));
    updateGameData();
    renderBoard();
    updateStatus(message);
    if (position === boardSize) {
        rollButton.disabled = true;
        updateStatus('Parabéns! Você chegou ao final e ajudou o planeta!');
    }
}

function askQuestion() {
    currentQuestion = getRandomQuestion();
    questionText.textContent = currentQuestion.question;
    answersElement.innerHTML = '';
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index));
        answersElement.appendChild(button);
    });
    questionCard.classList.remove('hidden');
    rollButton.disabled = true;
    isWaitingAnswer = true;
    updateStatus('Responda a pergunta para continuar.');
}

function hideQuestionCard() {
    questionCard.classList.add('hidden');
    rollButton.disabled = false;
    isWaitingAnswer = false;
}

function checkAnswer(answerIndex) {
    if (!currentQuestion) {
        return;
    }
    const correct = answerIndex === currentQuestion.correct;
    const move = correct ? 2 : -1;
    const message = correct
        ? 'Resposta correta! Você avança duas casas.'
        : 'Resposta errada. Você volta uma casa e tenta de novo.';
    hideQuestionCard();
    movePlayer(position + move, message);
    currentQuestion = null;
}

function handleSpecialSquare() {
    const special = specialSquares[position];
    if (!special) {
        updateStatus('Role o dado novamente para continuar.');
        return;
    }

    if (special.type === 'pergunta') {
        askQuestion();
        return;
    }

    const nextPosition = position + special.move;
    const actionName = special.type === 'rampa' ? 'Você encontrou uma rampa verde' : 'Uma cobra ecológica apareceu';
    const message = `${actionName}! ${special.move > 0 ? 'Avance' : 'Volte'} ${Math.abs(special.move)} casas.`;
    movePlayer(nextPosition, message);
}

function rollDice() {
    if (isWaitingAnswer) {
        return;
    }
    const dice = Math.floor(Math.random() * 6) + 1;
    diceValueElement.textContent = dice;
    const nextPosition = position + dice;
    movePlayer(nextPosition, `Você rolou ${dice}.`);
    if (position < boardSize) {
        handleSpecialSquare();
    }
}

rollButton.addEventListener('click', rollDice);

updateGameData();
renderBoard();
