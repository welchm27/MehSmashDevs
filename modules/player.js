import { controls } from "./input.js";

// Player class
class Player {
    constructor(x, y, width, height, color, image, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.normalHeight = height; // Store the normal height
      this.crouchHeight = height / 2; // Define the crouch height
      this.color = color;
      this.image = image;
      this.speed = speed;
      this.damagePercentage = 0;
      this.isJumping = false;
      this.jumpHeight = 30;
      this.jumpDuration = 5;
      this.jumpFrames = 0;
      this.initialY = y; // Store the initial y position
      this.id = id; // Add an ID property to uniquely identify each player
    }
  // Add methods for player-specific functionality
  move(canvas) {
    if (controls.left) {
      // Move left
      this.x -= this.speed;
    } else if (controls.right) {
      // Move right
      this.x += this.speed;
    } 

    // Limit the player within the canvas bounds
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    if (controls.up && !this.isJumping && controls.canJump) {
      // Start the jump
      this.isJumping = true;
      controls.canJump = false;
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
        controls.canJump = true;
      }
    }
  }

  crouch() {
    this.height = this.crouchHeight;
    this.y = this.y + (this.normalHeight - this.crouchHeight);
    this.isCrouching = true;
  }

  unCrouch() {
    this.height = this.normalHeight;
    this.y = this.y - (this.normalHeight - this.crouchHeight);
    this.isCrouching = false;
  }
}

const playerImg = new Image();
playerImg.src = "./Woodcutter.png"

// Create the player object
export const player = new Player(10,140,5,5,"blue", playerImg,3);