// DOM Elements
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const healthEl = document.getElementById('health');
const timeEl = document.getElementById('time');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let playerSpeed = 60;
let score = 0;
let health = 100;
let timeLeft = 60;
let gameInterval;
let isGameOver = false;

// Player position
let playerPosX = window.innerWidth / 2 - 25;
let playerPosY = window.innerHeight - 70;

// Move Player (Arrow keys)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPosX > 0) {
        playerPosX -= playerSpeed;
    } else if (e.key === 'ArrowRight' && playerPosX < window.innerWidth - 50) {
        playerPosX += playerSpeed;
    }
    updatePlayerPosition();
});

// Update player position
function updatePlayerPosition() {
    player.style.left = `${playerPosX}px`;
}

// Generate Coins and Obstacles
function generateItem(type) {
    if (isGameOver) return;

    const item = document.createElement('div');
    item.classList.add(type);
    item.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
    item.style.top = `-30px`;
    gameArea.appendChild(item);

    // Move item down the screen
    const moveInterval = setInterval(() => {
        const itemPosY = item.offsetTop;
        item.style.top = `${itemPosY + (type === 'coin' ? 4 : 6)}px`; // Coins move slower

        if (itemPosY > window.innerHeight) {
            item.remove();
            clearInterval(moveInterval);
        }

        // Collision detection
        if (checkCollision(player, item)) {
            if (type === 'coin') {
                score += 10;
                item.remove();
            } else if (type === 'obstacle') {
                health -= 10;
                item.remove();
                updateHealth();
            }
            updateScore();
        }
    }, 30);
}

// Collision Detection
function checkCollision(player, item) {
    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return !(
        playerRect.top > itemRect.bottom ||
        playerRect.bottom < itemRect.top ||
        playerRect.left > itemRect.right ||
        playerRect.right < itemRect.left
    );
}

// Update Score
function updateScore() {
    scoreEl.textContent = score;
}

// Update Health
function updateHealth() {
    healthEl.textContent = `${health}%`;
    if (health <= 0) {
        endGame();
    }
}

// Timer
function updateTime() {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

// Start Game
function startGame() {
    isGameOver = false;
    score = 0;
    health = 100;
    timeLeft = 60;
    updateScore();
    updateHealth();
    timeEl.textContent = timeLeft;

    gameOverScreen.style.display = 'none';

    gameInterval = setInterval(() => {
        updateTime();
        if (Math.random() < 0.5) {
            generateItem('coin');
        } else {
            generateItem('obstacle');
        }
    }, 1000);
}

// End Game
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreEl.textContent = score;
    gameOverScreen.style.display = 'block';
}

// Restart Game
restartBtn.addEventListener('click', () => {
    startGame();
});

// Initialize Game
startGame();
