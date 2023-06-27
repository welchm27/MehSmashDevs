import { Player } from "./modules/player.js";
import { handleKeyDown, handleKeyUp } from "./modules/input.js";

// Get a reference to the canvas and its 2D rendering context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Event listener for player input
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

// Create the player object
 export const player = new Player(100,140,10,10,'blue',3);

// Enemy class
class Enemy {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.damagePercentage = 0;
    // Add more properties and methods as needed
  }

  // Add methods for enemy-specific functionality
}


// Create the enemy character object
const enemy = new Enemy(200, 140, 10, 10, 'red', 3);

// Function to update the game state
function update() {
  // Update player position based on input or AI
    player.move(canvas);
  // Update enemy position based on AI

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

  // Render the enemy character
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// Game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();