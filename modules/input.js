import { player } from "./player.js";

export const controls = {
  left: false, // Is the left arrow key pressed?
  right: false, // Is the right arrow key pressed?
  up: false, // Is the up arrow key pressed?
  down: false, // Is the down arrow key pressed?
  space: false, // Is the spacebar pressed?
  canJump: true // Can the player jump?
};


// Event listeners for player controls
export function handleKeyDown(event) {
    if (event.key === "a") {
      controls.left = true;
    } else if (event.key === "d") {
      controls.right = true;
    } else if (event.key === "w") {
      controls.up = true;
    } else if (event.key === "s") {
      controls.down = true;
      player.crouch();
    }
}
export function handleKeyUp(event) {
    if (event.key === "a") {
      controls.left = false;
    } else if (event.key === "d") {
      controls.right = false;
    } else if (event.key === "w") {
      controls.up = false;
    } else if (event.key === "s") {
      controls.down = false;
      player.unCrouch();
    } 
}
