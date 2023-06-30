let grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");

let playAgain = document.querySelector(".playAgain");
let returnToMain = document.querySelector(".returnToMain");
let scoreDisplay = document.querySelector(".scoreDisplay");

let left = document.querySelector(".left");
let bottom = document.querySelector(".bottom");
let right = document.querySelector(".right");
let up = document.querySelector(".up");

let width = 30;
let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.8;
let intervalTime = 0;
let interval = 0;

// event listener loaded immediately
// watches for clicks on the keyboard
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", control);
  createBoard();
  startGame();
  playAgain.addEventListener("click", replay);
  returnToMain.addEventListener("click", goBackToHome);

  function goBackToHome() {
    window.location.href = "../../index.html"; // Navigate to another HTML page
  }
});

// create 100 divs in the 10x10 grid (game board)
// then append the new grid to the board
function createBoard() {
  popup.style.display = "none";
  for (let i = 0; i < 900; i++) {
    let div = document.createElement("div");
    grid.appendChild(div);
  }
}

// -----The startGame function------
function startGame() {
  let squares = document.querySelectorAll(".grid div");
  randomApple(squares);
  // random apple
  direction = 1;
  scoreDisplay.innerHTML = score;
  intervalTime = 1000;
  currentSnake = [2, 1, 0];
  currentIndex = 0;
  currentSnake.forEach((index) => squares[index].classList.add("snake"));
  interval = setInterval(moveOutcome, intervalTime);
}

// -------MoveOutcome function--------
function moveOutcome() {
  let squares = document.querySelectorAll(".grid div");
  if (checkForHits(squares)) {
    alert("you hit something");
    popup.style.display = "flex";
    return clearInterval(interval);
  } else {
    moveSnake(squares);
  }
}

// -------moveSnake function--------
function moveSnake(squares) {
  let tail = currentSnake.pop();
  squares[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  // movement ends here
  eatApple(squares, tail);
  squares[currentSnake[0]].classList.add("snake");
}

// --------checkForHits function---------
function checkForHits(squares) {
  if (
    (currentSnake[0] + width >= width * width && direction === width) ||
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    (currentSnake[0] % width === 0 && direction === -1) ||
    (currentSnake[0] - width <= 0 && direction === -width) ||
    squares[currentSnake[0] + direction].classList.contains("snake")
  ) {
    return true;
  } else {
    return false;
  }
}

// ----------eatApple function-----------
function eatApple(squares, tail) {
  if (squares[currentSnake[0]].classList.contains("apple")) {
    squares[currentSnake[0]].classList.remove("apple");
    squares[tail].classList.add("snake");
    currentSnake.push(tail);
    randomApple(squares);
    score++;
    scoreDisplay.textContent = score;
    clearInterval(interval);
    intervalTime = intervalTime * speed;
    interval = setInterval(moveOutcome, intervalTime);
  }
}

//---------randomApple function----------
function randomApple(squares) {
  do {
    appleIndex = Math.floor(Math.random() * squares.length);
  } while (squares[appleIndex].classList.contains("snake"));
  squares[appleIndex].classList.add("apple");
}

//---------setup controls
function control(e) {
  if (e.keyCode === 39) {
    // 39=right arrow
    direction = 1; //right
  } else if (e.keyCode === 38) {
    // 38=up arrow
    direction = -width; // if we press the up the snake will go 10 divs up
  } else if (e.keyCode === 37) {
    // 37=left arrow
    direction = -1; // left, the snake will go left one div
  } else if (e.keyCode === 40) {
    // 40=down arrow
    direction = +width; // down, the snake will instantly appear 10 divs below the current div
  }
}

// ---------movement for the on screen buttons-------------
up.addEventListener("click", () => (direction = -width));
bottom.addEventListener("click", () => (direction = +width));
left.addEventListener("click", () => (direction = -1));
right.addEventListener("click", () => (direction = 1));

// ------------replay button------------
function replay() {
  grid.innerHTML = "";
  createBoard();
  startGame();
  popup.style.display = "none";
  score = 0; // reset the score to 0
  scoreDisplay.textContent = score; // update the score display
}
