"use strict";
console.log("hello world");
let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = 0;
let speed = 200;
let gameStarted = true;
let gameInfo = document.getElementById('game-info');
let eatSound = new Audio("../eat.mp3");
let gameOverSound = new Audio("../gameOver.mp3");
let gameSound = new Audio("../game.mp3");
const foodIcons = [
    '🍏', // Green Apple
    '🍎', // Red Apple
    '🍌', // Banana
    '🍒', // Cherries
    '🍇', // Grapes
    '🍉',
    '🍓',
    '🥝',
    '🥭'
];
let currentFoodIcon = '';
window.addEventListener("keydown", (e) => {
    const newDirection = getDirection(e.key);
    const allowChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowChange)
        direction = newDirection;
});
function getDirection(key) {
    switch (key) {
        case "ArrowUp":
        case "w":
            return { key, dx: 0, dy: -20 };
        case "ArrowDown":
        case "s":
            return { key, dx: 0, dy: 20 };
        case "ArrowLeft":
        case "a":
            return { key, dx: -20, dy: 0 };
        case "ArrowRight":
        case "d":
            return { key, dx: 20, dy: 0 };
        default:
            return direction;
    }
}
function moveSnake() {
    const head = Object.assign({}, snake[0]);
    head.top += direction.dy;
    head.left += direction.dx;
    snake.unshift(head);
    if (snake[0].top < 0)
        snake[0].top = 380;
    if (snake[0].left < 0)
        snake[0].left = 380;
    if (snake[0].top > 380)
        snake[0].top = 0;
    if (snake[0].left > 380)
        snake[0].left = 0;
    if (eatFood()) {
        eatSound.play();
        score += 2;
        speed = speed - 5;
        food = null;
    }
    else {
        snake.pop();
    }
}
function randomFood() {
    food = {
        top: Math.floor(Math.random() * 20) * 20,
        left: Math.floor(Math.random() * 20) * 20,
    };
    currentFoodIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
}
function eatFood() {
    if (food && snake[0].top === food.top && snake[0].left === food.left) {
        food = null;
        return true;
    }
    return false;
}
function gameOver() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].top === snake[0].top && snake[i].left === snake[0].left)
            return true;
    }
    return false;
}
function drawSnake() {
    const gameBoard = document.getElementById("game-board");
    if (gameBoard) {
        gameBoard.querySelectorAll(".snake").forEach((el) => el.remove());
        snake.forEach((item, index) => {
            const snakeElement = document.createElement("div");
            snakeElement.style.top = `${item.top}px`;
            snakeElement.style.left = `${item.left}px`;
            snakeElement.classList.add("snake");
            if (index === 0)
                snakeElement.classList.add("head");
            gameBoard.appendChild(snakeElement);
        });
    }
}
function drawFood() {
    const gameBoard = document.getElementById("game-board");
    if (gameBoard && food) {
        gameBoard.querySelectorAll(".food").forEach((el) => el.remove());
        const foodElement = document.createElement("div");
        foodElement.style.top = `${food.top}px`;
        foodElement.style.left = `${food.left}px`;
        foodElement.classList.add("food");
        foodElement.innerText = currentFoodIcon;
        gameBoard.appendChild(foodElement);
    }
}
function updateScore() {
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");
    if (scoreElement && highScoreElement) {
        scoreElement.innerText = "Score:" + score;
        highScoreElement.innerText = "High Score:" + highScore;
    }
}
function gameLoop() {
    if (gameOver()) {
        gameStarted = false;
        gameOverSound.play();
        gameSound.pause();
        gameSound.currentTime = 0;
        //     if(gameInfo){
        //     gameInfo.innerText = "Game Over"
        //   }
        // alert("Game over");
        if (score > highScore) {
            highScore = score;
        }
        score = 0;
        speed = 200;
        snake = [{ top: 200, left: 200 }];
        direction = { key: "ArrowRight", dx: 20, dy: 0 };
        food = null;
        randomFood();
    }
    setTimeout(() => {
        const gameBoard = document.getElementById("game-board");
        if (gameBoard) {
            gameBoard.innerHTML = "";
        }
        moveSnake();
        if (!food)
            randomFood();
        gameSound.play();
        updateScore();
        drawSnake();
        drawFood();
        gameLoop();
    }, speed);
}
// randomFood();
// drawSnake();
// drawFood();
gameLoop();
