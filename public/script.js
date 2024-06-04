"use strict";
console.log("hello world");
const gameBoard = document.getElementById("game-board");
console.log(gameBoard);
const startButton = document.getElementById("start-game");
console.log(startButton);
// gameBoard === null || gameBoard === void 0
//   ? void 0
//   : gameBoard.addEventListener("mousemove", () => {
//       console.log("moving");
//     });
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log(isMobile);

const MAX_WIDTH = 680;
const MAX_HEIGHT = 480;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = 0;
let speed = 200;
let gameStarted = false;
let gameBoardHeight = min(window.innerHeight, MAX_HEIGHT);
let gameBoardWidth = min(window.innerWidth - 60, MAX_WIDTH - 60);
let gameInfo = document.getElementById("game-info");
let eatSound = new Audio("../eat.mp3");
let gameOverSound = new Audio("../gameOver.mp3");
let gameSound = new Audio("../game.mp3");
const foodIcons = [
  "⚽" // Green Apple
  
];

let currentFoodIcon = "";
startButton === null || startButton === void 0
  ? void 0
  : startButton.addEventListener("click", () => {
      console.log("Clicked");
      startGame();
    });
if (isMobile) {
//   gameBoard === null || gameBoard === void 0
//     ? void 0
//     : gameBoard.addEventListener("touch", () => {
//         startGame();
//       });
  if (gameBoard) {
    gameBoard.addEventListener("touchstart", handleTouchStart, false);
    gameBoard.addEventListener("touchmove", handleTouchMove, false);
    gameBoard.addEventListener("touchend", handleTouchEnd, false);
    console.log("Touch events attached to gameBoard");
  }
} else {
  window.addEventListener("keydown", (e) => {
    const newDirection = getDirection(e.key);
    const allowChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowChange && gameStarted) direction = newDirection;
  });
}
function handleTouchStart(e) {
  const firstTouch = e.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}
function handleTouchMove(e) {
  const touch = e.touches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
}
function handleTouchEnd() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) changeDirection("ArrowRight");
    else changeDirection("ArrowLeft");
  } else if (Math.abs(dx) < Math.abs(dy)) {
    if (dy > 0) changeDirection("ArrowDown");
    else changeDirection("ArrowUp");
  } else {
    console.log("inside eleee");
  }
}
function changeDirection(key) {
  const newDirection = getDirection(key);
  const allowChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
  if (allowChange && gameStarted) direction = newDirection;
}
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
  if (snake[0].top < 0) snake[0].top = gameBoardHeight - 20;
  if (snake[0].left < 0) snake[0].left = gameBoardWidth - 20;
  if (snake[0].top > gameBoardHeight - 20) snake[0].top = 0;
  if (snake[0].left > gameBoardWidth - 20) snake[0].left = 0;
  if (eatFood()) {
    console.log("food eaten")
    eatSound.play();
    score += 2;
    speed = speed - 5;
    food = null;
  } else {
    snake.pop();
  }
}
function randomFood() {
    const maxX = Math.floor((gameBoardWidth - 20)/20);
    const maxY = Math.floor((gameBoardHeight - 20)/20);
  food = {
    top: Math.floor(Math.random() * maxY) * 20,
    left: Math.floor(Math.random() * maxX) * 20
  };
  currentFoodIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
}
function eatFood() {
  if(food && snake[0]){
  
  const roundedHeadTop = Math.round(snake[0].top);
  const roundedHeadLeft = Math.round(snake[0].left);
  const roundedFoodTop = Math.round(food.top);
  const roundedFoodLeft = Math.round(food.left);
 if(roundedHeadTop === roundedFoodTop && roundedHeadLeft === roundedFoodLeft) {
   food = null;
   console.log("running")

    return true;
    
 }
 
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
  if (gameBoard) {
    gameBoard.querySelectorAll(".snake").forEach((el) => el.remove());
    snake.forEach((item, index) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.top = `${item.top}px`;
      snakeElement.style.left = `${item.left}px`;
      snakeElement.classList.add("snake");
      if (index === 0) snakeElement.classList.add("head");
      gameBoard.appendChild(snakeElement);
    });
  }
}
function drawFood() {
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
  if (!gameStarted) {
    if (gameInfo && !isMobile) {
      gameInfo.innerText = "Press Space to Start";
    }
   
    // window.addEventListener("keydown", startGame, { once: true });
    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        startGame();
        
      }
    });
    return;
  }
  if (gameOver()) {
   
    const gameBoard =  document.getElementById("game-board");
    if (gameBoard) {
      gameBoard.innerHTML = "";
      const gameOverMessage = document.createElement("div");
      gameOverMessage.classList.add("game-over-message");
      gameOverMessage.innerText = `Game Over. Score: ${score}. Press Space to Play Again.`;
      gameBoard.appendChild(gameOverMessage);
      console.log(gameBoard.innerHTML);
      if(isMobile){
        gameOverMessage.innerText = `Game Over. Score: ${score}`
        startButton.style.display = "block";
      }
    } 
    
    gameStarted = false;
    gameSound.pause();
    gameOverSound.play();
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
    window.removeEventListener("keydown", startGame);
    return;
  }
  setTimeout(() => {
    const gameBoard = document.getElementById("game-board");
    if (gameBoard) {
      gameBoard.innerHTML = "";
    }
    moveSnake();
    if (!food) randomFood();
    if (gameStarted) {
      gameSound.play();
    }
    
    updateScore();
    drawSnake();
    drawFood();
    gameLoop();
  }, speed);
}

function startGame() {
  gameStarted = true;
  speed = 200;
  startButton.style.display = "none";
  if (gameInfo) {
    gameInfo.innerText = "";
  }
  gameLoop(); 
}
// randomFood();
// drawSnake();
// drawFood();
gameLoop();

function min(num1, num2) {
  return num1 < num2 ? num1 : num2;
}

function max(num1, num2) {
  return num1 > num2 ? num1 : num2;
}

window.addEventListener("DOMContentLoaded", () => {
  gameBoard.style.width = min(window.innerWidth - 60, MAX_WIDTH - 60) + "px";
  gameBoard.style.height =min(window.innerHeight, MAX_HEIGHT) + "px";
});

// rotate on 600px
window.addEventListener("resize", () => {
  //Calculate new dimensions based on window size,ensuring divisibility by 20
let newWidth = Math.floor((window.innerWidth - 60)/20) * 20;
let newHeight = Math.floor((window.innerHeight)/20) * 20;

//Update gameBoard Dimensions

gameBoard.style.width = newWidth + "px";
gameBoard.style.height = newHeight + "px";

//Ensure gameBoardHeight and gameBoardWidth variables are updated

gameBoardHeight = newHeight;
gameBoardWidth = newWidth;

console.log("Resized game board to :",newWidth,"x",newHeight);
  


  // }
});
