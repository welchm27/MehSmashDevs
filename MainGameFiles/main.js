import { player } from "../modules/player.js";
import { handleKeyDown, handleKeyUp } from "../modules/input.js";
import { enemy1 } from "../modules/enemy.js";

// Get a reference to the canvas and its 2D rendering context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Define stage elements
const stageElements = [
   // Platform 1
   {
    x: canvas.width * 0.2,  // Left position of the platform (20% from the left)
    y: canvas.height - 35,  // 25px above the bottom of the canvas
    width: canvas.width * 0.6,  // Width of the platform (60% of the canvas width)
    height: 10,  // Height of the platform (10px)
  },
  // Platform 2
  {
    x: canvas.width *0.04,
    y: canvas.height -75,
    width: canvas.width * 0.15,
    height: 10,
  },
  //Platform 3
  {
    x: canvas.width *0.80,
    y: canvas.height -75,
    width: canvas.width * 0.15,
    height: 10,
  },
  //Platform 4
  {
    x: canvas.width *0.42,
    y: canvas.height -120,
    width: canvas.width * 0.15,
    height: 10,
  }

  // Add more platforms here if needed
  // Each element should have properties like x, y, width, height
];

// Event listener for player input
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);



// Function to update the game state
function update() {
  // Update player position based on input or AI
  player.move(canvas);

  // Update enemy position based on AI (chasing behavior)
  enemy1.chase(player);
  enemy1.jump(canvas);

  // Check for collisions between characters and stage elements
  checkCollisions();
  // Update damage percentages and check for knockouts

  // Render the game elements
  render();

  
}

// Function to check for collisions between characters and stage elements
function checkCollisions() {
  // Check player collision with stage elements
  stageElements.forEach((element) => {
    if (checkCollision(player, element)) {
      // Handle collision between player and element
      handlePlayerCollision(player, element);
    }
  });

  // Check enemy collision with stage elements
  stageElements.forEach((element) => {
    if (checkCollision(enemy1, element)) {
      // Handle collision between enemy and element
      // For example, stop enemy movement or perform an action
    }
  });
}

// Function to handle collision between the player and a stage element
function handlePlayerCollision(player, element) {
  // Check if the player is above the element
  if (player.y + player.height <= element.y) {
    // Snap the player's position to the top of the element
    player.y = element.y - player.height;
    // Reset the player's vertical velocity to prevent falling through the element
    player.vy = 0;
    // Set the player's jumping state to false
    player.isJumping = false;
  }
  // Add additional collision responses as needed
}

// Function to check collision between two rectangles
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Function to render the game elements on the canvas
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render the stage elements
  ctx.fillStyle = "gray";
  stageElements.forEach((element) => {
    ctx.fillRect(element.x, element.y, element.width, element.height);
  });

  // Render the player character
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Render the enemy characters
  ctx.fillStyle = enemy1.color;
  ctx.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height);
}

// Game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();