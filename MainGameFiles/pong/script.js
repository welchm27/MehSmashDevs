const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WIN_SCORE = 3;

let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
let paddle1Y = 250;
let paddle2Y = 250;

let player1Score = 0;
let player2Score = 0;

let showingWinScreen = false;



canvas.setAttribute ("width", 800);
canvas.setAttribute ("height", 600);

function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    // gets the x and y location based on the canvas and not the total page
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}


window.onload = function() {
    const framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', function(evt) {
        let mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function ballReset() {
    if(player1Score >= WIN_SCORE ||
        player2Score >= WIN_SCORE){
            showingWinScreen = true;
        }

    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

    if (paddle2YCenter < ballY-35) {
        paddle2Y += 15;
    } else if (paddle2YCenter > ballY+35) {
        paddle2Y -= 15;
    }
}

function computerP1Movement() {
    let paddle1YCenter = paddle1Y + (PADDLE_HEIGHT/2);

    if (paddle1YCenter < ballY-35) {
        paddle1Y += 15;
    } else if (paddle1YCenter > ballY+35) {
        paddle1Y -= 15;
    }
}

function moveEverything() {
    if(showingWinScreen) {
        
        return;
    }

    computerMovement();
    computerP1Movement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if (ballX < 0) {
        if(ballY > paddle1Y &&
            ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                
                let deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);

                ballSpeedY = deltaY * 0.35;
            }else {
                player2Score++;
                ballReset();
            }
    }
    if (ballX > canvas.width) {
        if(ballY > paddle2Y &&
            ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                let deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }else {
                player1Score++;
                ballReset();
            }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

}

function drawNet() {
    for (let i=0; i<canvas.height; i+=40){
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    // background canvas for gameboard
    colorRect(0, 0, canvas.clientWidth, canvas.height, 'black');

    if (showingWinScreen) {
        canvasContext.fillStyle = "white";

        if(player1Score >= WIN_SCORE){
                canvasContext.fillText("Left Player Won!", 350, 200)
        }else if (player2Score >= WIN_SCORE){
            canvasContext.fillText("Right Player Won!", 350, 200)
        }
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to continue", 350, 300);
        return;
    }

    drawNet();
    // left player 1 paddle (x, y, width, height, color)
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'blue');
    // right computer paddle (x, y, width, height, color)
    colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'green');
    
    // ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    // colorRect(ballX, ballY, 10, 10, 'orange');
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);

}