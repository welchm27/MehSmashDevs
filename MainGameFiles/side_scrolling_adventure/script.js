window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const bgMusic = document.getElementById("bgMusic");

  function displayWelcomeText() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);

    canvas.addEventListener("click", function handleClick() {
      runGame();
      bgMusic.volume = 0.2;
      bgMusic.play();

      canvas.removeEventListener("click", handleClick);
    });
  }

  displayWelcomeText();

  function runGame() {
    let gameSpeed = 15;
    const HIT_BOX_HEIGHT = 2.6;
    let health = 100;
    let gameOver = false;
    canvas.width = 800;
    canvas.height = 700;
    bgMusic.volume = 0.1;
    let enemies = [];
    let score = 0;

    const backgroundLayer1 = new Image();
    backgroundLayer1.src = "./assets/background_layers/layer-1.png";
    const backgroundLayer2 = new Image();
    backgroundLayer2.src = "./assets/background_layers/layer-2.png";
    const backgroundLayer3 = new Image();
    backgroundLayer3.src = "./assets/background_layers/layer-3.png";
    const backgroundLayer4 = new Image();
    backgroundLayer4.src = "./assets/background_layers/layer-4.png";
    const backgroundLayer5 = new Image();
    backgroundLayer5.src = "./assets/background_layers/layer-5.png";

    const slider = document.getElementById("slider");
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById("showGameSpeed");
    showGameSpeed.innerText = gameSpeed;
    slider.addEventListener("change", function (e) {
      gameSpeed = e.target.value;
      showGameSpeed.innerText = e.target.value;
    });

    class Layer {
      constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
      }
      update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
          this.x = 0;
        }
        this.x = this.x - this.speed;
      }
      draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(
          this.image,
          this.x + this.width,
          this.y,
          this.width,
          this.height
        );
      }
    }

    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);

    const gameObjects = [layer1, layer2, layer3, layer4, layer5];

    class InputHandler {
      constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e) => {
          // if e.key is 's' and also this key is not in the array (-1), then add it
          if (
            (e.key === "s" ||
              e.key === "w" ||
              e.key === "d" ||
              e.key === "a" ||
              e.key === "s") &&
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
            e.key === "a" ||
            e.key === "s"
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
        context.imageSmoothingEnabled = false;

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
            context.arc(
              this.x + this.width,
              this.y + this.height * HIT_BOX_HEIGHT,
              this.width,
              0,
              Math.PI * 2
            ); // location and size of circle hitbox
            context.stroke(); // draw circle hitbox
            */
      }
      update(input, deltaTime, enemies) {
        // collision detection
        enemies.forEach((enemy) => {
          const dx = enemy.x + enemy.width / 4 - (this.x + this.width); // builds an imaginary triangle from middle of enemy to bottom of player
          const dy =
            enemy.y +
            enemy.height / 4 -
            (this.y + this.height * HIT_BOX_HEIGHT); // and from bottom of player to middle of player
          const distance = Math.sqrt(dx * dx + dy * dy); // finds the distance of the Hypotenuse of the imaginary triangle
          if (distance < enemy.width / 3 + this.width) {
            // if that distance is less than half the width of the enemy and player
            health--;
            if (health <= 0) {
              gameOver = true;
            }
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
        if (input.keys.indexOf("w") > -1 && this.onGround()) {
          this.vy -= 30;
        }
        if (input.keys.indexOf("a") > -1) {
          this.speed = -5;
        } else if (input.keys.indexOf("d") > -1) {
          this.speed = 5;
        } else {
          this.speed = 0;
        }
        if (input.keys.indexOf("s") > -1) {
          gameSpeed = 0;
        } else {
          gameSpeed = slider.value;
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

    // class Background {
    //   constructor(gameWidth, gameHeight) {
    //     this.gameWidth = gameWidth;
    //     this.gameHeight = gameHeight;
    //     this.image = document.getElementById("backgroundImage");
    //     this.x = 0;
    //     this.y = 0;
    //     this.width = 2400;
    //     this.height = 720;
    //     this.speed = 10;
    //   }
    //   draw(context) {
    //     context.drawImage(this.image, this.x, this.y, this.width, this.height);
    //     context.drawImage(
    //       this.image,
    //       this.x + this.width - this.speed,
    //       this.y,
    //       this.width,
    //       this.height
    //     );
    //   }
    //   update() {
    //     this.x -= this.speed;
    //     if (this.x < 0 - this.width) this.x = 0;
    //   }
    // }

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
        this.speed = gameSpeed;
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
          context.arc(this.x + this.width / 2 - 20,this.y + this.height / 2,this.width / 3,0,Math.PI * 2
          ); // circle hitbox
          context.stroke(); // draw the circle hitbox
          */
      }

      update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
          if (this.speed >= 1) {
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
          }
        } else {
          this.frameTimer += deltaTime;
        }
        this.x -= gameSpeed;
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
      context.fillStyle = "orange";
      context.fillText("Score: " + score, 22, 52);
      context.fillStyle = "black";
      context.fillText("Health: " + health, 20, 90);
      context.fillStyle = "red";
      context.fillText("Health: " + health, 22, 92);
      context.font = "20px Helvetica";
      context.fillStyle = "black";
      context.fillText("Controls:", 650, 30);
      context.fillStyle = "orange";
      context.fillText("Controls:", 652, 32);
      context.fillStyle = "black";
      context.fillText("W: Jump", 650, 50);
      context.fillStyle = "orange";
      context.fillText("W: Jump", 652, 52);
      context.fillStyle = "black";
      context.fillText("A: Move Left", 650, 70);
      context.fillStyle = "orange";
      context.fillText("A: Move Left", 652, 72);
      context.fillStyle = "black";
      context.fillText("D: Move Right", 650, 90);
      context.fillStyle = "orange";
      context.fillText("D: Move Right", 652, 92);
      context.fillStyle = "black";
      context.fillText("S: Pause (Hold)", 650, 110);
      context.fillStyle = "orange";
      context.fillText("S: Pause (Hold)", 652, 112);
      context.fillStyle = "black";

      if (gameOver) {
        context.textAlign = "center";
        context.fillStyle = "black";
        context.font = "40px Helvetica";
        context.fillText("GAME OVER, try again!", canvas.width / 2, 200);
        context.fillStyle = "red";
        context.fillText("GAME OVER, try again!", canvas.width / 2 + 2, 202);
        // box and text for RESTART
        context.fillStyle = "green";
        ctx.fillRect(280, 305, 240, 60);
        ctx.fillStyle = "white";
        ctx.fillText("RESTART", 400, 350);
        // box and text for Back to main menu
        context.fillStyle = "darkblue";
        ctx.fillRect(220, 403, 360, 60);
        ctx.fillStyle = "white";
        ctx.fillText("Back to main menu", 400, 445);
        // set click function for Game Over screen
        canvas.addEventListener("click", function (event) {
          const rect = canvas.getBoundingClientRect();
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;
          if (
            mouseX >= 283 &&
            mouseX <= 523 &&
            mouseY >= 315 &&
            mouseY <= 385
          ) {
            location.reload();
          }
          if (
            mouseX >= 223 &&
            mouseX <= 583 &&
            mouseY >= 415 &&
            mouseY <= 485
          ) {
            goBackToHome();
            function goBackToHome() {
              window.location.href = "../../index.html"; // Navigate to another HTML page
            }
          }
        });
      }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    // const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameObjects.forEach((object) => {
        object.draw();
        object.update();
      });
      // background.draw(ctx);
      // background.update();
      player.draw(ctx);
      player.update(input, deltaTime, enemies);
      handleEnemies(deltaTime);
      displayStatusText(ctx);
      if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
  }
});
