
// Constant variables
const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const framesPerSecond = 30;
const PADDLE_DIST_FROM_EDGE = 60;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;

let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;
let paddleX = 400;
let mouseX = 0;
let mouseY = 0;
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
let bricksLeft = 0;


// Canvas Attributes
canvas.setAttribute ("width", 800);
canvas.setAttribute ("height", 600);


window.onload = function() {    
    setInterval(updateAll, 1000/framesPerSecond);
    canvas.addEventListener('mousemove', updateMousePos);
    
    brickReset();
    ballReset();
}

function brickReset() {
    bricksLeft = 0;
    let i;

    for (i=0; i< 3 * BRICK_COLS; i++){
        brickGrid[i] = false;
    }
    for (; i< BRICK_COLS * BRICK_ROWS; i++){
        brickGrid[i] = true;
        bricksLeft++
    }   // end of for
}   // end of brickReset

function updateAll() {
    moveAll();
    drawAll();
}

function updateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - PADDLE_WIDTH/2;

    // cheat to test ball position
    /*ballX = mouseX;
    ballY = mouseY;
    ballSpeedX = 3;
    ballSpeedY = -4 */
}

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX > canvas.width && ballSpeedX > 0.0) {  // right
        ballSpeedX *= -1;
    }
    if(ballX < 0 && ballSpeedX < 0.0) {             // left
        ballSpeedX *= -1;
    }
    if(ballY < 0 && ballSpeedY < 0.0) {             // top
        ballSpeedY *= -1;
    }
    if(ballY > canvas.height) { // bottom
        ballReset();
        brickReset();
    }

}

function isBrickAtColRow(col, row) {
    if(col >= 0 && col < BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS) {
        let brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false;
    }
}

function ballBrickHandling() {
    let ballBrickCol = Math.floor (ballX / BRICK_W);
    let ballBrickRow = Math.floor (ballY / BRICK_H);
    let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
            
            if(isBrickAtColRow(ballBrickCol, ballBrickRow)) {
                brickGrid[brickIndexUnderBall] = false;
                bricksLeft--;
                // console.log(bricksLeft);

                let prevBallX = ballX - ballSpeedX;
                let prevBallY = ballY - ballSpeedY;
                let prevBrickCol = Math.floor(prevBallX/BRICK_W);
                let prevBrickRow = Math.floor(prevBallY/BRICK_H)

                let bothTestsFailed = true;

                if(prevBrickCol != ballBrickCol) {
                    if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                        ballSpeedX *= -1;
                        bothTestsFailed = false;
                    }
                }

                if(prevBrickRow != ballBrickRow) {
                    if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                        ballSpeedY *= -1;
                        bothTestsFailed = false;
                    }
                }

                if (bothTestsFailed) {  // corner case reverses ball
                    ballSpeedX *= -1;
                    ballSpeedY *= -1;
                }
                
            }   // end of brick found
        }   // end of valid col and row
}   // end of ballBrickHandling

function ballPaddleHandling() {
    const paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    const paddleBottomEdgeY = paddleTopEdgeY + PADDLE_HEIGHT;
    let paddleLeftEdgeX = paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

    if (ballY > paddleTopEdgeY &&       // below the top of the paddle
        ballY < paddleBottomEdgeY &&    // above the bottom of the paddle
        ballX > paddleLeftEdgeX &&      // right of the left edge of paddle
        ballX < paddleRightEdgeX) {     // left of the right edge of paddle
        ballSpeedY *= -1;
        
        let centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
        let ballDistancFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistancFromPaddleCenterX * 0.35;

        if(bricksLeft == 0) {
            brickReset();
        }   // out of bricks
    }   // ball center inside paddle
}   // end of ballPaddlingHandling

function moveAll() {
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();
}

function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');  // clear screen
    colorCircle(ballX, ballY, 10, 'white');

    colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawBricks();


}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle (centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = 'red';
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    for(let eachRow = 0; eachRow<BRICK_ROWS; eachRow++){
        for(let eachCol=0; eachCol<BRICK_COLS; eachCol++) {
        
            let arrayIndex = BRICK_COLS * eachRow + eachCol;
           
            if(brickGrid[arrayIndex]){
                colorRect(BRICK_W*eachCol, BRICK_H*eachRow, 
                   BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, 'blue');
            }   // end of this brick
        }    // end of each brick
    }
}