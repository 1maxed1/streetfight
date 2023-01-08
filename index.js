const canvas = document.querySelector("canvas");

//Selecting the context off the canvas
const c = canvas.getContext("2d");

//Set width and height off the canvas
canvas.width = 1024;
canvas.height = 576;

//Set the canvas color

c.fillRect(0, 0, canvas.width, canvas.height);

//Gravity
const gravity = 1;
//create class Sprite
class Sprite {
  //Object for simple Creation
  constructor({ position, velocity, color = "red", offset }) {
    //This references the obj --> Here Sprite
    //Position is an object containing x and y coordinates
    this.position = position;
    //Velocity to determine the direction the sprite is moving
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.width = 50;
    this.isAttacking;
    //100 HP am Anfang
    this.health = 100;
  }
  //Draws out shape etc of the sprite
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //Attack box
    //Only when spacebar pressed

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    //Gets bigger every time
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attacking() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//creates a player
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

//Creates an enemy
const enemy = new Sprite({
  position: {
    x: 500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const rectCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const animate = () => {
  //animate will loop over and over --> Loop
  window.requestAnimationFrame(animate);
  //Sets the background of the canvas to black
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //Animates the sprites
  player.update();
  enemy.update();

  //will be overwritten if a key is pressed
  //player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    //-1 pixel
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    //-1 pixel
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }
  //Detect for a collusion
  if (
    rectCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    //Spacebar has to be pressed again
    player.isAttacking = false;
    console.log("Player attacked enemy");
    //Subtract HP per hit
    enemy.health -= 20;
    //Select the container for the health of the enemy
    //Is decreasing with every hit
    const hbenemy = document.getElementById("enemy-health-subtract");
    hbenemy.style.width = enemy.health + "%";
  }
  if (
    rectCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("Enemy attacked player");
    player.health -= 20;
    const hbplayer = document.getElementById("player-health-subtract");
    hbplayer.style.width = player.health + "%";
  }
};

animate();

//Controll section
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      //Moves the Sprite right
      keys.d.pressed = true;
      //Sets the last key property to "d"
      player.lastKey = "d";
      break;
    case "a":
      //Moves the Sprite left via setting the state to true
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      //Moves the Sprite up
      player.velocity.y = -20;
      break;
    case " ":
      player.attacking();
      break;

    //enemy
    case "ArrowRight":
      //Moves the Sprite right
      keys.ArrowRight.pressed = true;
      //Sets the last key property to "d"
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      //Moves the Sprite left via setting the state to true
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      //Moves the Sprite up
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attacking();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      //sets velocity = 0 --> Stops the Sprites movement
      keys.d.pressed = false;
      break;
    case "a":
      //After keydown --> State is set to false
      keys.a.pressed = false;
      break;
  }
  //enemy keys
  switch (event.key) {
    case "ArrowRight":
      //sets velocity = 0 --> Stops the Sprites movement
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      //After keydown --> State is set to false
      keys.ArrowLeft.pressed = false;
      break;
  }
});
