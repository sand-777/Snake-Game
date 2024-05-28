

console.log("hello world");
interface Position {
    top: number;
    left: number;
}

interface Direction {
    key: string;
    dx: number;
    dy: number;
}



let snake: Position[] = [{ top: 200, left: 200 }];
let direction: Direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food: Position | null = null;
let score: number = 0;
let highScore: number = 0;
let speed: number = 200;
let gameStarted: boolean = true;

let gameInfo = document.getElementById('game-info');

let eatSound =  new Audio("../eat.mp3");
let gameOverSound = new Audio("../gameOver.mp3")
let gameSound = new Audio("../game.mp3")


const foodIcons = [
    '🍏', // Green Apple
    '🍎', // Red Apple
    '🍌', // Banana
    '🍒', // Cherries
    '🍇',// Grapes
     '🍉',
     '🍓',
     '🥝',
     '🥭'
];

let currentFoodIcon: string = '';


window.addEventListener("keydown", (e: KeyboardEvent) => {
    const newDirection = getDirection(e.key);
    const allowChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowChange) direction = newDirection;
});

function getDirection(key: string): Direction {
    switch (key) {
        case "ArrowUp":
        case "w":
            return { key, dx: 0, dy: -20 };

        case "ArrowDown":
        case "s":
            return { key, dx: 0, dy: 20 };

        case "ArrowLeft":
        case "a":
            return { key, dx: -20, dy:0 };

        case "ArrowRight":
        case "d":
            return { key, dx: 20, dy: 0 };

        default:
            return direction;
    }
}

function moveSnake(): void {
    const head: Position = { ...snake[0] };
    head.top += direction.dy;
    head.left += direction.dx;
    snake.unshift(head);

    if (snake[0].top < 0) snake[0].top = 380;
    if (snake[0].left < 0) snake[0].left = 380;
    if (snake[0].top > 380) snake[0].top = 0;
    if (snake[0].left > 380) snake[0].left = 0;

   if(eatFood()){
  
    eatSound.play();
    score += 2;
    speed = speed-5;
    food = null;
   } else{
    snake.pop()
   }
}

function randomFood(): void {
    food = {
        top: Math.floor(Math.random() * 20) * 20,
        left: Math.floor(Math.random() * 20) * 20,
    };

    currentFoodIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
}

function eatFood(): boolean {
    if (food && snake[0].top === food.top && snake[0].left === food.left) {
        food = null;
        return true;
       
    }
    return false;
}

function gameOver(): boolean {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].top === snake[0].top && snake[i].left === snake[0].left)
            return true;
        
    }
    return false;
}

function drawSnake(): void {
    const gameBoard = document.getElementById("game-board");

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

function drawFood(): void {
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

function updateScore(): void {
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");

    if (scoreElement && highScoreElement) {
        scoreElement.innerText = "Score:" + score;
        highScoreElement.innerText = "High Score:" + highScore;
    }
}


function gameLoop(): void {
    
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
        if (!food) randomFood();
    
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
