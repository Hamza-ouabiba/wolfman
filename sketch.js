let wolves = []
let obstacles = [];
let wolfMan;
let principal;
let mode = 'normal'
let enemy;
function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);

  // creation des wolves  :
  wolves.push(new Wolf(random(width),random(height),"red","wolf 3",0,1,700))
  // creation du wolfman : 
  wolfMan = new WolfMan(random(width),random(height),"blue","wolfman");
  // creation du joueur principal : 
  //creation des obstacles : 
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));
}

function draw() {
  background("black");
  fill("red");
  stroke("white");
  let rayonDeDetection = 70;
  // // dessin de l'ennemie : 
  
  wolfMan.applyBehaviors(Behavior.seek,createVector(mouseX,mouseY))
  wolfMan.update();
  wolfMan.show();
  // ce point va etre le target des wolves : 
  let behindTarget = wolfMan.PointBehind();
  // dessin des obstacles:  
  obstacles.forEach(o => {
    o.show();
  })
 
  if(Character.debug) {
     // dessin de la souris
      fill("white")
      circle(mouseX,mouseY,30)
  }
  
  // dessin des wolves qui suivent le wolfman :
  wolves.forEach((w,index) => {
    switch(mode) {
      case "snake": 
        {
          w.bullets = [];
          if(index === 0) {
            w.applyBehaviors(Behavior.seek,wolfMan.pos);
          } else {
            w.applyBehaviors(Behavior.seek,wolves[index - 1].pos);
          }

        };break;
      case "normal": {
       
        w.applyBehaviors(Behavior.seek,wolfMan.pos);
      };break;
      case "leader": {
        w.bullets = [];
        w.applyBehaviors(Behavior.seek,behindTarget);
      };break;
      case "enemy": {
        enemy.update();
        enemy.drawPri();
        enemy.applyBehaviors();
        // et tirent sur lui
        // mettre a jour la direction du wolf en fonction de la position du principal
        // juste que le wolf va regarder le principal mais en il est arrete
        w.addBullet(Date.now());
        for(let i = 0; i < w.bullets.length; i++) {
          let b = w.bullets[i];
          b.show();
          b.move(enemy);
          b.applyBehaviors();
          // on l'enlève et on diminue le vie de l'ennemie
          if(b.hit(enemy))
          {
            w.removeBullet(b);
            enemy.health -= 20;
          } else {
            // il faut que l'enemie flee les bullets
            let fleeForce = Behavior.flee(enemy,b.pos);
            fleeForce.mult(0.1);
            enemy.applyForce(fleeForce);
          }
          b.update();
        }
        if(enemy.health <= 0) {
          mode = "normal";
          enemy = null;
          w.bullets = [];
          break;
        }
        w.vel = p5.Vector.sub(enemy.pos,w.pos).normalize().mult(0);
      };break;
    }
    w.show();
    w.update();
  })

}

// ajout d'un obstacle a la position de la souris
function mousePressed() {
   obstacles.push(new Obstacle(mouseX,mouseY,50,"green"))
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
