class Character {
    constructor(x, y,color,name,behaviors) {
      this.name = name;
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = 6;
      this.maxForce = 0.25;
      this.seekWeight = 1
      this.fleeWeight = 10
      // rayon du véhicule
      this.r = 19;
      this.color = color;
      this.rayonZoneDeFreinage = 150;
      this.distanceSeparation = this.r ;
      this.separateWeight = 7;
      // Pour le confinement
      this.boundariesWeight = 10;


      // Pour évitement d'obstacle
      this.distanceAhead = 50;
      this.largeurZoneEvitementDevantVaisseau = this.r / 2;
      this.avoidWeight = 3;

      // Paramètres comportement confinement
      this.boundariesX = 0;
      this.boundariesY = 0
      this.boundariesWidth = width;
      this.boundariesHeight = height;
      this.boundariesDistance = 25;
    }


    drawVector(pos, v, color) {
      push();
      strokeWeight(3);
      stroke(color);
      line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
      let arrowSize = 5;
      translate(pos.x + v.x, pos.y + v.y);
      rotate(v.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }


    applyBehaviors(behavior,target) {
      let boundariesForce = this.boundaries(this.boundariesX, this.boundariesY, this.boundariesWidth, this.boundariesHeight, this.boundariesDistance);
      boundariesForce.mult(this.boundariesWeight);
      // pour tous les personnages on applique le comportement de séparation
      // combiner le wolfMan et les wolves dans un seul tableau
      let boids = [wolfMan,...wolves];
      let separateForce = Behavior.separate(this.distanceSeparation,this,boids);
      separateForce.mult(this.separateWeight);

      // pour tous les personnages on applique le comportement d'évitement d'obstacle
      let avoidForce = Behavior.avoid(this,obstacles);
      avoidForce.mult(this.avoidWeight)
      // pour le wolf et le wolfMan on applique le comportement de arrive
      if(this instanceof Wolf || this instanceof WolfMan) {
        let seekForce = behavior(this,target,true);
        seekForce.mult(this.seekWeight);
        this.applyForce(seekForce);
      } 

   

      // le comportement leader : 
      // on applique le flee si on est dans la zone devant le leader 
      // sinon on applique le seek
      // mais on calcule d'abbord la distance 
      if(this instanceof Wolf && mode === "leader") {
        // on projette un ahead devant le leader
        let ahead = wolfMan.vel.copy();
        ahead.normalize();
        ahead.mult(40);
        let pointAuBoutDeAhead = wolfMan.pos.copy().add(ahead);
        // verifier si le wolf est dans la zone devant le leader
        let distance = this.pos.dist(pointAuBoutDeAhead);
        if(distance < wolfMan.sightRadius) {
          console.log("oui flee")
          let fleeForce = Behavior.flee(this,wolfMan.pos);
          fleeForce.mult(this.fleeWeight);
          this.applyForce(fleeForce);
        }
        // dessin du cercle de vision du leader
        push();
        noFill();
        stroke("red");
        circle(pointAuBoutDeAhead.x,pointAuBoutDeAhead.y,wolfMan.sightRadius * 2);
        pop();
       
      }

      if(this instanceof Wolf && mode === "enemy") {
          // je vois si le tableau des bullets n'est pas vide: 
          // si c'est le cas je tire
        
      }
      this.applyForce(boundariesForce);
      this.applyForce(avoidForce);
      this.applyForce(separateForce);
    }
  
    applyForce(force) {
      this.acc.add(force)
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  
    // On dessine le véhicule
    show() {

      // si un missile on dessine un trait : 
      if(this instanceof Bullet) {
        push();
        stroke("red");
        strokeWeight(4);
        point(this.pos.x,this.pos.y);
        pop();
        return;
      }
      stroke(255);
      strokeWeight(2);
  
      fill(this.color);
  
      push();
      
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
  
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      
      pop();
  
      if(Character.debug) {
        this.drawVelocityVector();
      }
    }
  
    drawVelocityVector() {
      push();
      strokeWeight(3);
      stroke("red");
      line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
      let arrowSize = 5;
      translate(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
      rotate(this.vel.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
     
    }
    

    boundaries(bx, by, bw, bh, d) {
      let vitesseDesiree = null;
  
      const xBordGauche = bx + d;
      const xBordDroite = bx + bw - d;
      const yBordHaut = by + d;
      const yBordBas = by + bh - d;

      push();

      noFill();
      stroke("white");
      rect(bx, by, bw, bh);

      stroke("red");
      rect(bx + d, by + d, bw - 2 * d, bh - 2 * d);

      pop();

      if (this.pos.x < xBordGauche) {
        // 
        vitesseDesiree = createVector(this.maxSpeed, this.vel.y);
      } else if (this.pos.x > xBordDroite) {
        vitesseDesiree = createVector(-this.maxSpeed, this.vel.y);
      }
  
      if (this.pos.y < yBordHaut) {
        vitesseDesiree = createVector(this.vel.x, this.maxSpeed);
      } else if (this.pos.y > yBordBas) {
        vitesseDesiree = createVector(this.vel.x, -this.maxSpeed);
      }
  
      if (vitesseDesiree !== null) {
        vitesseDesiree.setMag(this.maxSpeed);
        const force = p5.Vector.sub(vitesseDesiree, this.vel);
        vitesseDesiree.limit(this.maxForce);
        return vitesseDesiree;
      }
  
      
      return createVector(0, 0);
    }

    
  }
  