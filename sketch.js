let wolves = []
let obstacles = [];
let wolfMan;
let principal;
let behavior;
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
  let target = p5.Vector.sub(wolfMan.pos, wolfMan.vel.copy().setMag(40));
  // dessin des obstacles:  
  obstacles.forEach(o => {
    o.show();
  })
  wolves.forEach((wolf, index) => {
    if(mode === "snake") {
      if (index === 0) {
        wolf.applyBehaviors(Behavior.seek,wolfMan.pos);
      } else {
        let wolfPrecedent = wolves[index - 1];
        wolf.applyBehaviors(Behavior.seek,wolfPrecedent.pos);
      }
    } else if(mode === "normal") {
       wolf.applyBehaviors(Behavior.seek,createVector(mouseX,mouseY))
    } else if(mode === "leader") {
      // comportement leader : 
      wolf.applyBehaviors(Behavior.seek,(createVector(target.x,target.y)));
    }l
    
    wolf.show()
    wolf.update()
  })

 
  // dessin du wolfman 
 
}



function keyPressed() {
    switch(key) {
       case 'd': Character.debug = !Character.debug;break;
       case 's': mode = 'snake';break;
       case 'l': mode = 'leader';break;
       case 'n': mode = 'normal';break;
    }
}
