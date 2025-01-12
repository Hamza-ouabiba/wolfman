let wolves = []
let obstacles = [];
let wolfMan;
let principal;
let mode = 'normal'

function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);

  // creation des wolves  :
  wolves.push(new Wolf(random(width),random(height),"red","wolf 1"))
  wolves.push(new Wolf(random(width),random(height),"red","wolf 2"))
  wolves.push(new Wolf(random(width),random(height),"red","wolf 3"))
  // creation du wolfman : 
  wolfMan = new WolfMan(random(width),random(height),"blue","wolfman")
  // creation du joueur principal : 
  principal = new Principal(random(width),random(height),"lightgreen","arthur")
  //creation des obstacles : 
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));
}

function draw() {
  background("black");
  fill("red");
  stroke("white");
  let rayonDeDetection = 70;
  // // dessin du joueur principal : 
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
        w.applyBehaviors(Behavior.seek,behindTarget);
      }
    }
    w.update();
    w.show();
  })

  // dessin du wolfman 
 
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
    }
}
