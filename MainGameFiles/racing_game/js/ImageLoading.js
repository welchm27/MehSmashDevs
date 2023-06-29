const carPic = document.createElement("img");
const otherCarPic = document.createElement("img");

let trackPics = [];
let picsToLoad = 0;  // set automatically based on loadImages function

function countLoadedImagesAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) {
        imageLoadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImagesAndLaunchIfReady;
    imgVar.src = fileName;
}

function loadImageForTrackCode (trackCode, fileName) {
    trackPics[trackCode] = document.createElement('img');
    beginLoadingImage(trackPics[trackCode], fileName);
}

function loadImages() {
    var imageList = [
        {varName: carPic, theFile: "./graphics/blueCar.png"},
        {varName: otherCarPic, theFile: "./graphics/greenCar.png"},
        
        {trackType: TRACK_ROAD, theFile: "./graphics/road.png"},
        {trackType: TRACK_WALL, theFile: "./graphics/wall.png"},
        {trackType: TRACK_TREE, theFile: "./graphics/trackTrees.png"},
        {trackType: TRACK_GOAL, theFile: "./graphics/trackGoal.png"}
    ];


/*
const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
*/
    picsToLoad = imageList.length;

    for (let i=0; i<imageList.length; i++) {
        if(imageList[i].varName != undefined) {
        beginLoadingImage(imageList[i].varName, imageList[i].theFile);
        } else {
        loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile);
        }
    }
}