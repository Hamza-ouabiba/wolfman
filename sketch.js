let wolves = []
let obstacles = [];
let wolfMan;
let mode = 'normal'
let enemy;
let sapinImage;
function preload() {
  // On charge une image de poisson
  sapinImage = loadImage('assets/sapin.jpg');
  wolfImage = loadImage('assets/wolf.jpg');
}

function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);

  // creation des wolves  :
  wolves.push(new Wolf(random(width),random(height),"red","wolf 3",0,1,700, wolfImage));
  // creation du wolfman : 
  wolfMan = new WolfMan(random(width),random(height),"blue","wolfman");
  // creation du joueur principal : 
  //creation des obstacles : 
  
  obstacles.push(new Obstacle(width / 2, height / 2, 50, "green",sapinImage));
  obstacles.push(new Obstacle(width / 2, height / 2, 50, "green",sapinImage));
}


function draw() {
  background("white");
  fill("red");
  stroke("white");

  // Dessin de wolfMan et des obstacles
  drawWolfMan();
  drawObstacles();

  if (Character.debug) {
    drawMouseDebug();
  }

  // Dessin des loups en fonction du mode
  wolves.forEach((w, index) => {
    switch (mode) {
      case "snake":
        handleSnakeMode(w, index);
        break;
      case "normal":
        handleNormalMode(w);
        break;
      case "leader":
        handleLeaderMode(w);
        break;
      case "enemy":
        handleEnemyMode(w);
        break;
    }
    w.show();
    w.update();
  });
}

// --- Fonction pour dessiner wolfMan ---
function drawWolfMan() {
  wolfMan.applyBehaviors(Behavior.seek, createVector(mouseX, mouseY));
  wolfMan.update();
  wolfMan.show();
}

// --- Fonction pour dessiner les obstacles ---
function drawObstacles() {
  obstacles.forEach((o) => {
    o.show();
  });
}

// --- Fonction pour dessiner la souris en mode debug ---
function drawMouseDebug() {
  fill("white");
  circle(mouseX, mouseY, 30);
}

// --- Mode "snake" ---
function handleSnakeMode(w, index) {
  w.bullets = [];
  if (index === 0) {
    w.applyBehaviors(Behavior.seek, wolfMan.pos);
  } else {
    w.applyBehaviors(Behavior.seek, wolves[index - 1].pos);
  }
}

// --- Mode "normal" ---
function handleNormalMode(w) {
  w.applyBehaviors(Behavior.seek, wolfMan.pos);
}

// --- Mode "leader" ---
function handleLeaderMode(w) {
  const behindTarget = wolfMan.PointBehind();
  w.applyBehaviors(Behavior.seek, behindTarget);
}

// --- Mode "enemy" ---
function handleEnemyMode(w) {
  let isCatched = false;

  // Dessin et mise à jour de l'ennemi
  enemy.drawPri();
  enemy.applyBehaviors();

  // Ajout de balles et gestion des interactions
  w.addBullet(Date.now());
  for (let i = 0; i < w.bullets.length; i++) {
    let b = w.bullets[i];
    b.show();
    b.move(enemy);
    b.applyBehaviors();

    if (enemy.hit(wolfMan)) {
      mode = "normal";
      enemy = null;
      w.bullets = [];
      isCatched = true;
      console.log("wolfMan a été touché");
      break;
    }

    if (b.hit(enemy)) {
      w.removeBullet(b);
      enemy.health -= 20;
    } else {
      let fleeForce = Behavior.flee(enemy, b.pos);
      let seekForce = Behavior.seek(enemy, wolfMan.pos);
      fleeForce.mult(enemy.seekWeight);
      seekForce.mult(enemy.seekWeight);
      enemy.applyForce(fleeForce);
      enemy.applyForce(seekForce);
    }
    b.update();
  }

  if (isCatched) return;

  if (enemy.health <= 0) {
    mode = "normal";
    enemy = null;
    w.bullets = [];
    return;
  }
  enemy.update();
  w.vel = p5.Vector.sub(enemy.pos, w.pos).normalize().mult(0);
}


// ajout d'un obstacle a la position de la souris
function mousePressed() {
   obstacles.push(new Obstacle(mouseX,mouseY,140,"green",sapinImage))
}

function keyPressed() {
    switch(key) {
       case 'd': Character.debug = !Character.debug;break;
       case 's': mode = 'snake';break;
       case 'l': mode = 'leader';break;
       case 'n': mode = 'normal';break;
       case 'w': wolves.push(new Wolf(random(width),random(height),"red","wolf 4"));break;
       case 'e': {
        mode = "enemy";
        enemy = new Principal(random(width),random(height),"yellow","principal");
       };break;  
    }
}
