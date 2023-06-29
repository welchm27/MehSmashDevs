// Get a reference to the canvas element and its context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// WHAT OBJECTS DO I NEED TO MAKE THE GAME
// Player spaceship properties
const player = {
  x: 0, // X-coordinate of the player spaceship
  y: 0, // Y-coordinate of the player spaceship
  speed: 3, // Speed of the player spaceship
  width: 50, // Width of the player spaceship
  height: 50 // Height of the player spaceship
};

// Player controls
const controls = {
  left: false, // Is the left arrow key pressed?
  right: false, // Is the right arrow key pressed?
  up: false, // Is the up arrow key pressed?
  down: false, // Is the down arrow key pressed?
  space: false, // Is the spacebar pressed?
  canShoot: true // Can the player shoot a bullet?
};

// Enemy Spaceship class
class Enemy {
  constructor(x, y, speed, width, height) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.direction = 1; // 1 represents moving to the right, -1 represents moving to the left
    this.canShoot = true; //this indicates if the enemy can shoot
  }

  draw() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x += this.speed * this.direction;

    // Check if enemy hits the canvas borders
    if (this.x + this.width >= canvas.width || this.x <= 0) {
      this.direction *= -1; // Reverse the direction
      this.y += this.height / 2; // Move the enemy down by its height
    }

    // Shoot a bullet randomly every 3 seconds
    if (this.canShoot && Math.random() < 0.003) {
      this.shootBullet();
      this.canShoot = false; // Prevent shooting for a period of time
      setTimeout(() => {
        this.canShoot = true;
      }, 3000); // Allow shooting again after 3 seconds
    }
  }

  shootBullet() {
    const bullet = {
      x: this.x + this.width / 2, // X-coordinate of the bullet (starts at the center of the enemy spaceship)
      y: this.y + this.height, // Y-coordinate of the bullet (starts below the enemy spaceship)
      speed: 5, // Speed of the bullet
      width: 5, // Width of the bullet
      height: 15, // Height of the bullet
    };
    enemyBullets.push(bullet);
  }
}


// Array to store enemy spaceships
let enemies = [];
 
// Array to store bullets
const bullets = [];
const enemyBullets = [];

// Initialize score
let score = 0;

//Initialize the wave number
let wave = 0;

// Game states
let gameStarted = false;
let gameRunning = false;

// Event listener for the start button
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

// Event listeners for player controls
function handleKeyDown(event) {
  if (event.key === "a") {
    controls.left = true;
  } else if (event.key === "d") {
    controls.right = true;
  } else if (event.key === "w") {
    controls.up = true;
  } else if (event.key === "s") {
    controls.down = true;
  } else if (event.key === " ") {
    if (!controls.space) {
      controls.space = true;
    }
  }
}

function handleKeyUp(event) {
  if (event.key === "a") {
    controls.left = false;
  } else if (event.key === "d") {
    controls.right = false;
  } else if (event.key === "w") {
    controls.up = false;
  } else if (event.key === "s") {
    controls.down = false;
  } else if (event.key === " ") {
    controls.space = false;
    controls.canShoot = true;
  }
}

// HOW WILL THE GAME WORK

// Start the game
function startGame() {
  if (!gameStarted) {
    //run the game
    initializeGame();
    gameLoop();
    gameStarted = true;

    // Hide the start button and remove its event listener
    startButton.style.display = 'none';
    startButton.removeEventListener('click', startGame);
  }
}

// Initialize the game
function initializeGame() {
  // Initialize player spaceship position
  player.x = canvas.width / 2 - player.width / 2; // Set player spaceship to the center horizontally
  player.y = canvas.height - player.height - 10; // Set player spaceship near the bottom vertically
  
  // Reset game state
  gameRunning = true;

  // Start score at 0 for the beginning of the game.
  score = 0; // Set the initial score to 0
  document.getElementById('score').textContent = "Score: " + score; // Update the "score" element
  
  // Start the game at wave 1
  wave = 0; // Set the initial wave number
  document.getElementById('wave').textContent = "Wave: " + wave; // Update the "wave" element

  // Start the game with 3 lives
  lives = 3;
  document.getElementById('lives').textContent = "Lives: " + lives;
  
  // Generate enemy spaceships
  enemies = [];
  generateEnemies();

  //add eventListener with the event and cooresponding functions as arguments
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  // Start the game loop
  gameLoop();
}

// Generate enemy spaceships
function generateEnemies() {
  const enemyCount = 5; // Number of enemies to generate

  for (let i = 0; i < enemyCount; i++) {
    let newEnemy;
    let collisionDetected;

    do {
      // Generate new enemy properties
      const x = Math.random() * (canvas.width - 40);
      const y = Math.random() * (canvas.height / 2);
      const speed = 1;
      const width = 40;
      const height = 40;

      // Create new enemy
      newEnemy = new Enemy(x, y, speed, width, height);

      //speed increase only happens up to wave 10.
      if (wave <= 10) {
        newEnemy.speed = speed * Math.pow(1.1,wave-1);
      } else {
        newEnemy.speed = speed * Math.pow(1.1,10-1);;
      }

      // Check for collisions with existing enemies
      collisionDetected = false;
      for (let j = 0; j < enemies.length; j++) {
        if (isCollision(newEnemy, enemies[j])) {
          collisionDetected = true;
          break;
        }
      }
    } while (collisionDetected);

    // Add new enemy to the array
    enemies.push(newEnemy);
  }
   //increment the wave every time new enemies are generated.
   wave++; // Increment the wave number
   document.getElementById('wave').textContent = "Wave: " + wave; // Update the "wave" element
}

// Game loop
function gameLoop() {
  if (!gameRunning) {
    // Game over, stop the game loop
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  movePlayer();
  drawEnemies();
  handleBullets();
  moveEnemyBullets();
  drawEnemyBullets();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

// Draw the player spaceship
function drawPlayer() {
  ctx.fillStyle = "#0000ff"; // Set the color of the player spaceship
  ctx.fillRect(player.x, player.y, player.width, player.height); // Draw the player spaceship rectangle
}

// Move the player spaceship
function movePlayer() {
  if (controls.left) {
    // Move left
    player.x -= player.speed;
  } else if (controls.right) {
    // Move right
    player.x += player.speed;
  }

  if (controls.up) {
    // Move up
    player.y -= player.speed;
  } else if (controls.down) {
    // Move down
    player.y += player.speed;
  }

  // Limit the player spaceship within the canvas bounds
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < 0) {
    player.y = 0;
  } else if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

// Draw and move the enemy spaceships
function drawEnemies() {
  for (const enemy of enemies) {
    enemy.move();
    enemy.draw();
  }
}

// Handle bullets (creation, movement, and deletion)
function handleBullets() {
  if (controls.space && controls.canShoot) {
    shootBullet();
    controls.canShoot = false;
  }

  moveBullets();
  drawBullets();
}

// Shoot a bullet
function shootBullet() {
  const bullet = {
    x: player.x + player.width / 2, // X-coordinate of the bullet (starts at the center of the player spaceship)
    y: player.y, // Y-coordinate of the bullet (starts at the top of the player spaceship)
    speed: 10, // Speed of the bullet
    width: 10, // Width of the bullet
    height: 10 // Height of the bullet
  };
  bullets.push(bullet);
}

// Move the bullets
function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= bullet.speed;

    // Remove bullets that have gone off the canvas
    if (bullet.y + bullet.height < 0) {
      bullets.splice(i, 1);
    }
  }
}

// Move the enemy bullets
function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    bullet.y += bullet.speed;

    // Remove bullets that have gone off the canvas
    if (bullet.y + bullet.height > canvas.height) {
      enemyBullets.splice(i, 1);
    }
  }
}

// Draw the bullets
function drawBullets() {
  for (const bullet of bullets) {
    ctx.fillStyle = "#ffff00"; // Set the color of the bullets
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); // Draw the bullet rectangle
  }
}

// Draw the enemy bullets
function drawEnemyBullets() {
  for (const bullet of enemyBullets) {
    ctx.fillStyle = "#ff3131"; // Set the color of the enemy bullets
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); // Draw the enemy bullet rectangle
  }
}

// Detect collisions between bullets and enemies
function detectCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      if (isCollision(bullet, enemy)) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++; // Increase the score
        document.getElementById('score').textContent = "Score: " + score; // Update the "score" element
        break; // Exit the inner loop since the bullet can collide with only one enemy
      }
    }
  }
  // Check collision between enemy bullets and the player
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];

    if (isCollision(bullet, player)) {
      enemyBullets.splice(i, 1);
      decrementLives();
      break;
    }
  }

  // Check if there are no enemies left
  if (enemies.length === 0) {
    clearEnemies(); // Clear the enemies array
    generateEnemies(); // Generate a new wave of enemies
  }
}

// Check if two objects are colliding - see dev notes for more verbose expalination.
function isCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Reset the enemy array to 0.
function clearEnemies() {
  enemies.length = 0; // Clear the enemies array
}

// Decrement player lives
function decrementLives() {
  let lives = parseInt(document.getElementById('lives').textContent.split(': ')[1]);

  if (lives > 0) {
    lives--;
    document.getElementById('lives').textContent = "Lives: " + lives;
  }

  if (lives === 0) {
    endGame(); // Implement this function to handle the game over logic
  }
}

function endGame() {
  gameRunning = false; // Set gameRunning to false to stop the game loop
  gameStarted = false;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Display "Game Over" message
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  //bring the start game button back
  const startButton = document.getElementById("start-button");
  startButton.style.display = "block";
  startButton.addEventListener('click', startGame);
}