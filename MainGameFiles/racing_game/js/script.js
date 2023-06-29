const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');

let blueCar = new carClass();
let greenCar = new carClass();

// Canvas Attributes
canvas.setAttribute ("width", 800);
canvas.setAttribute ("height", 600);

window.onload = function() {  
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

    loadImages();
}

function imageLoadingDoneSoStartGame() {
    const framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);
    setupInput();
    loadLevel(levelList[levelNow]);

}

function firstLevel() {
    levelNow = 0;
    loadLevel(levelList[levelNow]);
}

function nextLevel() {
    levelNow++
    if(levelNow >= levelList.length){
        levelNow = 0;
    }
    loadLevel(levelList[levelNow]);
}

function loadLevel(whichLevel) {
    trackGrid = whichLevel.slice();
    greenCar.reset(otherCarPic, "Green Machine");
    blueCar.reset(carPic, "Blue Storm");
}

function updateAll() {
    moveAll();
    drawAll();
}

function moveAll() {
    greenCar.move();
    blueCar.move();
}

function drawAll() {
    drawTracks();
    greenCar.draw();
    blueCar.draw();
}
