let game;

function preload() {
  sapinImage = loadImage('assets/sapin.jpg');
  wolfImage = loadImage('assets/wolf.jpg');
}

function setup() {
  console.log("Setup started.");
  createCanvas(windowWidth, windowHeight);

  // Initialize game
  game = new Game();
  game.addWolf(new Wolf(random(width), random(height), "red", "wolf 3", 0, 1, 700, wolfImage));
  game.wolfMan = new WolfMan(random(width), random(height), "blue", "wolfman");
  game.addObstacle(new Obstacle(width / 2, height / 2, 100, "green"));
}

function draw() {
  background("black");
  fill("red");
  stroke("white");

  game.drawEntities();
}

function mousePressed() {
  game.addObstacle(new Obstacle(mouseX, mouseY, 140, "green", sapinImage));
}

function keyPressed() {
  switch (key) {
    case 'd':
      Character.debug = !Character.debug;
      break;
    case 's':
      game.mode = 'snake';
      break;
    case 'l':
      game.mode = 'leader';
      break;
    case 'n':
      game.mode = 'normal';
      break;
    case 'w':
      game.addWolf(new Wolf(random(width), random(height), "red", "wolf 4", 0, 1, 700, wolfImage));
      break;
    case 'e':
      game.mode = 'enemy';
      game.enemy = new Principal(random(width), random(height), "yellow", "principal");
      break;
  }
}