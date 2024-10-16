const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesDisplay: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1200, // Velocidade inicial do jogo
        initialVelocity: 1000, // Valor para resetar a velocidade ao reiniciar
        hitPosition: 0,
        result: 0,
        currentTime: 30,
        lives: 3,
        gameActive: true,
        speedIncrement: 100, // Valor de incremento da velocidade por acerto
        maxVelocity: 300 // Velocidade mínima que o jogo pode atingir
    },
    actions: {
        countDownTimerId: null,
        timerId: null,
    },
    leaderboard: []
};

function countDown() {
    if (state.values.gameActive) {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;

        if (state.values.currentTime <= 0) {
            gameOver();
        }
    }
}

function gameOver() {
    if (!state.values.gameActive) return;

    state.values.gameActive = false;
    playGameOverSound();

    const gameOverMessage = document.getElementById("game-over-message");
    const finalResult = document.getElementById("final-result");
    finalResult.textContent = state.values.result;
    gameOverMessage.style.display = "block";

    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    saveToLeaderboard(state.values.result);
    displayLeaderboard();
}

function restartGame() {
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.style.display = "none";

    state.values.gameActive = true;
    state.values.lives = 3;
    state.values.currentTime = 30;
    state.values.result = 0;
    state.values.gameVelocity = state.values.initialVelocity; // Reseta a velocidade

    updateLivesDisplay();
    state.view.score.textContent = state.values.result;

    state.actions.countDownTimerId = setInterval(countDown, 1000);
    clearInterval(state.actions.timerId);

    moveEnemy();
}

function loseLife() {
    if (state.values.gameActive) {
        state.values.lives--;
        updateLivesDisplay();

        if (state.values.lives > 0) {
            moveEnemy();
        } else {
            gameOver();
        }
    }
}

function updateLivesDisplay() {
    state.view.livesDisplay.textContent = 'x' + state.values.lives;
}

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.2;
    audio.play();
}

function playGameOverSound() {
    let gameOverAudio = new Audio("./src/audios/over.wav");
    gameOverAudio.volume = 0.2;
    gameOverAudio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.actions.timerId = setInterval(() => {
        randomSquare();

        if (state.values.result % 10 === 0 && state.values.result !== 0) {
            state.values.gameVelocity -= 100; // Aumenta a dificuldade mais rapidamente a cada 10 acertos
        } else {
            state.values.gameVelocity -= state.values.speedIncrement; // Diminui um pouco a cada acerto normal
        }

        if (state.values.gameVelocity < state.values.maxVelocity) {
            state.values.gameVelocity = state.values.maxVelocity; // Impede que a velocidade fique muito rápida
        }

        clearInterval(state.actions.timerId);
        moveEnemy(); // Reinicia o movimento mais rápido
    }, state.values.gameVelocity);
}

function onSquareClick() {
    if (state.values.gameActive && this.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        playSound();

        clearInterval(state.actions.timerId); // Interrompe o inimigo atual
        moveEnemy(); // Reinicia o movimento após o acerto
    } else {
        loseLife();
    }
}

state.view.squares.forEach(square => square.addEventListener("click", onSquareClick));

function saveToLeaderboard(score) {
    state.leaderboard.push(score);
    state.leaderboard.sort((a, b) => b - a);
}

function displayLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    const scoreList = document.getElementById("score-list");
    scoreList.innerHTML = '';

    state.leaderboard.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `Pontuação: ${score}`;
        scoreList.appendChild(li);
    });

    leaderboard.style.display = "block";
}

// Inicializa o jogo
state.actions.countDownTimerId = setInterval(countDown, 1000);
moveEnemy();

