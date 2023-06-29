import { player } from "../modules/player.js";
import { controls, handleKeyDown, handleKeyUp } from "../modules/input.js";
import { enemy1 } from "../modules/enemy.js";

// Get a reference to the canvas and its 2D rendering context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

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

  // Update damage percentages and check for knockouts

  // Render the game elements
  render();

  
}

// Function to render the game elements on the canvas
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render the stage elements

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