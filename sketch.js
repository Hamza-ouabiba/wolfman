
let game;
let gameOver = false;
function preload() {
  sapinImage = loadImage('assets/saping.png');
  wolfManImage = loadImage('assets/wolfman.png');
  principalImage = loadImage('assets/principal.png');
  pixelFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-solid-900.ttf'); // You can replace with your font
}

function setup() {
  console.log("Setup started.");
  createCanvas(windowWidth, windowHeight);

  // lui afficher en bas les différentes touches du jeu
  // c'est a dire si e est appuyé alors on affiche le principal
  // si s est appuyé alors on affiche le snake
  // si l est appuyé alors on affiche le leader
  // si n est appuyé alors on affiche le normal
  // si w est appuyé alors on ajoute un wolf
  // juste pour le fun


  // creation d'un boutton : 
  // le placer en bas a gauche un peu grande taille: :
  // le dessiner en Jaune avec un font en pixelFont
  button = createButton('Instructions');
  button.position(10, height - 50);
  button.size(100, 50);
  button.style('background-color', 'yellow');
  button.style('font-family', 'pixelFont');
  // les instructions c'est que le wolves suivent le wolfMan
  // et lorsque on clique sur e 
  button.mousePressed(() => {
    alert("Instructions\n\n" +
          "- E - Afficher un ennemi en tirant dessus par des fireballs\n" +
          "- S - Afficher le mode Snake\n" +
          "- L - Afficher le mode Leader\n" +
          "- N - Afficher le mode Normal\n" +
          "- W - Ajouter un Wolf \n" +
          "- R - Appuyez sur 'R' pour redémarrer le jeu\n"
   )});

  const posYSliderDeDepart = 3;
  // Initialize game
  game = new Game();
  game.addWolf(new Wolf(random(width), random(height), "red", "wolf 3", 0, 1, 700));
  game.wolfMan = new WolfMan(random(width), random(height), "blue", "wolfman",wolfManImage);
  game.creerUnSlider("Poids séparation loups", game.wolves, 0, 15, 3, 0.1, 10, posYSliderDeDepart,"separateWeight");
  game.creerUnSlider("Poids boundaries", game.wolves, 0, height, 10, 1, 10, posYSliderDeDepart+30,"boundariesWeight");
  game.creerUnSlider("Rayon des loups", game.wolves, 4, 40, 6, 1, 10, posYSliderDeDepart+60,"r");
  game.creerUnSlider("speed", game.wolves, 4, 40, 6, 1, 10, posYSliderDeDepart+90,"maxSpeed");
  game.creerSliderNbVehicules(10,  posYSliderDeDepart+120, "Nombre de loups", 1, 200, 1, 1);  // deployer les obstacles
  // sans repetition
  const obstaclePositions = [
    { x: 100, y: 150 },
    { x: 300, y: 200 },
    { x: 500, y: 350 },
    { x: 700, y: 100 },
    { x: 900, y: 400 },
    { x: 150, y: 500 },
    { x: 350, y: 600 },
    { x: 550, y: 250 },
    { x: 750, y: 350 },
    { x: 950, y: 150 },
    { x: 200, y: 300 },
    { x: 400, y: 450 },
    { x: 800, y: 200 },
    { x: 250, y: 400 },
    { x: 650, y: 600 },
    { x: 1250, y: 250 },
    { x: 1050, y: 350 },
    { x: 1090, y: 550 },
];

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

  background("black");
  fill("red");
  stroke("white");
  game.drawEntities();
}
// display the game over screen
function displayGameOver() {
  fill(255, 0, 0); // Red color
  textAlign(CENTER, CENTER);
  textSize(64); // Large font size for Game Over text
  text("GAME OVER", width / 2, height / 2 - 50);
  textSize(32); // Smaller font for instructions
  text("Press R to Restart", width / 2, height / 2 + 50);
}

// function mousePressed() {
//   game.addObstacle(new Obstacle(mouseX, mouseY, 140, "green", sapinImage));
// }


function keyPressed() {
  switch (key.toLowerCase()) {
    case 'r':
      setup();
      gameOver = false;
      break;
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
      game.addWolf(new Wolf(random(width), random(height), "red", "wolf 4", 0, 1, 700));
      break;
    case 'e':
      game.mode = 'enemy';
      game.enemy = new Principal(random(width), random(height), "yellow", "principal", principalImage);
      break;
  }
}
