const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesDisplay: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 30,
        lives: 3,
        gameActive: true,
    },
    actions: {
        countDownTimerId: null,
        timerId: null,
    },
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
    if (!state.values.gameActive) {
        return;
    }

    state.values.gameActive = false;

    // Reproduz o som de "Game Over"
    playGameOverSound();

    // Exibe a mensagem de Game Over no HTML
    const gameOverMessage = document.getElementById("game-over-message");
    const finalResult = document.getElementById("final-result");
    finalResult.textContent = state.values.result;

    gameOverMessage.style.display = "block";

    // Limpa todos os intervalos de tempo existentes
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    // Reinicia o jogo após um atraso de 2 segundos (ajuste conforme necessário)
    setTimeout(restartGame, 2000);
}

function restartGame() {
    // Esconde a mensagem de Game Over
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.style.display = "none";

    // Reinicia o jogo
    state.values.gameActive = true;
    state.values.lives = 3;
    state.values.currentTime = 30;
    state.values.result = 0;
    updateLivesDisplay();

    // Atualiza o elemento de pontuação
    state.view.score.textContent = state.values.result;

    // Inicia os intervalos de tempo novamente
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    // Limpa o intervalo de movimento do inimigo
    clearInterval(state.actions.timerId);

    // Inicia o movimento do inimigo novamente
    moveEnemy();
}

function loseLife() {
    if (state.values.gameActive) {
        state.values.lives--;
        updateLivesDisplay();

        if (state.values.lives > 0) {
            // Se ainda houver vidas, continue o jogo
            moveEnemy();
        } else {
            // Se não houver mais vidas, chame a função de game over
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
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function onSquareClick() {
    if (state.values.gameActive && this.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound();
    } else {
        loseLife();
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", onSquareClick);
    });
}

function init() {
    moveEnemy();
    addListenerHitBox();
    updateLivesDisplay();
    state.actions.countDownTimerId = setInterval(countDown, 800);
}

init();