window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        // if e.key is 's' and also this key is not in the array (-1), then add it
        if (
          (e.key === "s" ||
            e.key === "w" ||
            e.key === "d" ||
            e.key === "a") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "s" ||
          e.key === "w" ||
          e.key === "d" ||
          e.key === "a"
        ) {
          // when we release a key, if that key is s, remove it from the array
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 48;
      this.height = 48;
      this.x = 10;
      this.y = this.gameHeight - this.height * 4;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width * 4,
        this.height * 4
      );
      /*   Draw the hitbox for the player
      context.strokeStyle = "white"; // white outline for hitbox
      context.beginPath(); // part of circle hitbox
      context.arc(this.x + this.width, this.y + this.height * 2.6, this.width, 0, Math.PI * 2); // location and size of circle hitbox
      context.stroke(); // draw circle hitbox
      */

    }
    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 4 - (this.x + this.width); // builds an imaginary triangle from middle of enemy to bottom of player
        const dy = enemy.y + enemy.height / 4 - (this.y + this.height * 2.6); // and from bottom of player to middle of player
        const distance = Math.sqrt(dx * dx + dy * dy); // finds the distance of the Hypotenuse of the imaginary triangle
        if (distance < enemy.width / 3 + this.width) {
          // if that distance is less than half the width of the enemy and player
          gameOver = true;                              // detect collision and gameOver = true
        }
      });
      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // controls
      if (input.keys.indexOf("d") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("a") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("w") > -1 && this.onGround()) {
        this.vy -= 30;
      } else {
        this.speed = 0;
      }
      // horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;
      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 0;
      } else {
        this.vy = 0;
        this.maxFrame = 5;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height * 4;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 10;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      /*  Draw the hitbox for the enemy
      context.strokeStyle = "white"; // white box around hitbox
      context.beginPath(); // part of circle hitbox
      context.arc(
        this.x + this.width / 2 - 20,
        this.y + this.height / 2,
        this.width / 3,
        0,
        Math.PI * 2
      ); // circle hitbox
      context.stroke(); // draw the circle hitbox
      */
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      console.log(enemies);
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
  }

  function displayStatusText(context) {
    context.font = "40px Helvetica";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 22, 52);
    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText("GAME OVER, try again!", canvas.width / 2, 200);
      context.fillStyle = "white";
      context.fillText("GAME OVER, try again!", canvas.width / 2 + 2, 202);
    }
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
