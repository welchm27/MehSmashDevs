import { player } from "./player.js";

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
        this.canEnemyJump = true; // Flag to determine if the enemy can jump
        this.isJumping = false;
        this.jumpHeight = 40; // Adjust the jump height as needed
        this.jumpDuration = 5;
        this.jumpFrames = 0;
        this.initialY = y; // Store the initial y position
        // Add more properties and methods as needed
      }
  
    // Add methods for enemy-specific functionality
    chase() {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
      
        if (distance <= 10) {
          return; // Stop chasing if within 10 pixels of the player
        }
      
        const directionX = dx / distance;
      
        this.x += directionX * this.speed;
      }
     
    jump(canvas) {
        if (!this.isJumping && this.canEnemyJump && player.isJumping) {
            // Start the jump
            this.isJumping = true;
            this.canEnemyJump = false;
            this.jumpFrames = this.jumpDuration;
          }
      
          if (this.isJumping) {
            // Perform the jump
            this.y -= this.jumpHeight / this.jumpDuration;
            this.jumpFrames--;
      
            if (this.jumpFrames === 0) {
            // End the jump
            this.isJumping = false;
            }
        } else {
            // Apply gravity
            this.y = Math.min(this.y + 1, canvas.height - this.height);
      
            if (this.y === canvas.height - this.height) {
              // Player has landed, allow jumping again
              this.canEnemyJump = true;
            }
        }
    }
}
  
  // Create the enemy character object
  export const enemy1 = new Enemy(200, 140, 5, 5, 'red', 1.5);