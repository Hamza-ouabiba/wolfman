let game;
let gameOver = false;
function preload() {
  sapinImage = loadImage("assets/saping.png");
  wolfManImage = loadImage("assets/wolfman.png");
  principalImage = loadImage("assets/principal.png");
}

function setup() {
  console.log("Setup started.");
  createCanvas(windowWidth, windowHeight);

  // creation d'un boutton :
  // le placer en bas a gauche un peu grande taille: :
  // le dessiner en Jaune avec un font en pixelFont
  button = createButton("Instructions");
  button.position(10, height - 50);
  button.size(100, 50);
  button.style("background-color", "yellow");
  // les instructions c'est que le wolves suivent le wolfMan
  // et lorsque on clique sur e
  button.mousePressed(() => {
    game.instructions();
  });

  const posYSliderDeDepart = 3;
  // Initialize game
  game = new Game();
  game.addWolf(
    new Wolf(random(width), random(height), "red", "wolf 3", 0, 1, 700)
  );
  game.wolfMan = new WolfMan(
    random(width),
    random(height),
    "blue",
    "wolfman",
    wolfManImage
  );
  game.creerUnSlider(
    "Poids séparation loups",
    game.wolves,
    0,
    15,
    3,
    0.1,
    10,
    posYSliderDeDepart,
    "separateWeight"
  );
  game.creerUnSlider(
    "Poids boundaries",
    game.wolves,
    0,
    40,
    10,
    1,
    10,
    posYSliderDeDepart + 30,
    "boundariesWeight"
  );
  game.creerUnSlider(
    "Rayon des loups",
    game.wolves,
    4,
    40,
    6,
    1,
    10,
    posYSliderDeDepart + 60,
    "r"
  );
  game.creerUnSlider(
    "max speed",
    game.wolves,
    0,
    40,
    3,
    1,
    10,
    posYSliderDeDepart + 90,
    "maxSpeed"
  );
  game.creerUnSlider(
    "max speed wolfMan ",
    game.wolfMan,
    0,
    40,
    3,
    1,
    10,
    posYSliderDeDepart + 120,
    "maxSpeed"
  );
  game.creerUnSlider(
    "max Force wolfMan ",
    game.wolfMan,
    0,
    40,
    3,
    1,
    10,
    posYSliderDeDepart + 150,
    "maxForce"
  );
  // se baser juste sur le w qui crée un nouveau loup
  // generer des positions d'obstacles de manière aléatoire sans repetition
  const obstaclePositions = [];
  while (obstaclePositions.length < 30) {
    const x = random(100, width - 100);
    const y = random(100, height - 100);
    const pos = { x, y };
    if (!obstaclePositions.some((p) => dist(p.x, p.y, x, y) < 100)) {
      obstaclePositions.push(pos);
    }
  }

  // Ajouter des obstacles au jeu en fonction des positions codées en dur
  obstaclePositions.forEach((pos) => {
    game.addObstacle(new Obstacle(pos.x, pos.y, 70, "green", sapinImage));
  });
}

function draw() {
  if (gameOver) {
    displayGameOver();
    return;
  }

  background("white");
  fill("red");
  stroke("white");
  game.affichageScore();
  game.drawEntities();
}
function displayGameOver() {
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("GAME OVER", width / 2, height / 2 - 50);
  textSize(32);
  text("Press R to Restart", width / 2, height / 2 + 50);
}

function keyPressed() {
  switch (key.toLowerCase()) {
    case "r":
      setup();

      gameOver = false;
      break;
    case "d":
      Character.debug = !Character.debug;
      break;
    case "s":
      game.mode = "snake";
      break;
    case "l":
      game.mode = "leader";
      break;
    case "n":
      game.mode = "normal";
      break;
    case "w":
      game.addWolf(
        new Wolf(random(width), random(height), "red", "wolf 4", 0, 1, 700)
      );
      break;
    case "e":
      game.mode = "enemy";
      game.enemy = new Principal(
        random(width),
        random(height),
        "yellow",
        "Arthur",
        principalImage
      );
      break;
  }
}
