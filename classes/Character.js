class Character {
    constructor(x, y,color,name,behaviors) {
      this.behaviors = behaviors;
      // Objet Behavior: 
      // nom du charactère : 
      this.name = name;
      // position du véhicule
      this.pos = createVector(x, y);
      // vitesse du véhicule
      this.vel = createVector(0, 0);
      // accélération du véhicule
      this.acc = createVector(0, 0);
      // vitesse maximale du véhicule
      this.maxSpeed = 6;
      // force maximale appliquée au véhicule
      this.maxForce = 0.25;

      this.seekWeight = 1
      // rayon du véhicule
      this.r = 16;
      this.color = color;
      this.rayonZoneDeFreinage = 150;
      // Paramètres pour separate (on pourra ajouter un curseur)
      this.distanceSeparation = this.r;
      this.separateWeight = 3;
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
      // Dessin du vecteur vitesse
      // Il part du centre du véhicule et va dans la direction du vecteur vitesse
      strokeWeight(3);
      stroke(color);
      line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
      // dessine une petite fleche au bout du vecteur vitesse
      let arrowSize = 5;
      translate(pos.x + v.x, pos.y + v.y);
      rotate(v.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }


    applyBehaviors(behavior,target) {
      let seekForce;
      let boundariesForce = this.boundaries(this.boundariesX, this.boundariesY, this.boundariesWidth, this.boundariesHeight, this.boundariesDistance);
      boundariesForce.mult(this.boundariesWeight);
      // j'applique la force de seek sur le wolf et le wolfman
      if(this instanceof Wolf || this instanceof WolfMan ) {
        seekForce = behavior(this,target,true);
        seekForce.mult(this.seekWeight)
        this.applyForce(seekForce);
        this.separateWolf(obstacles);
      }
      
      this.applyForce(boundariesForce)
    }
  
    // applyForce est une méthode qui permet d'appliquer une force au véhicule
    // en fait on additionne le vecteurr force au vecteur accélération
    applyForce(force) {
      this.acc.add(force)
    }
  
    update() {
      // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
      // (accélératiion = dérivée de la vitesse)
      this.vel.add(this.acc);
      // on contraint la vitesse à la valeur maxSpeed
      this.vel.limit(this.maxSpeed);
      // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
      // (la vitesse est la dérivée de la position)
      this.pos.add(this.vel);
  
      // on remet l'accélération à zéro
      this.acc.set(0, 0);
    }
  
    // On dessine le véhicule
    show() {
      // formes fil de fer en blanc
      stroke(255);
      // épaisseur du trait = 2
      strokeWeight(2);
  
      // formes pleines en blanc
      fill(this.color);
  
      // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
      // position et rotation du repère de référence)
      push();
      
      // on déplace le repère de référence.
      translate(this.pos.x, this.pos.y);
      // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
      rotate(this.vel.heading());
  
      //circle(0, 0, this.r * 2);
  
      // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      // Que fait cette ligne ?
      //this.edges();
      
      pop();
  
      // draw velocity vector
      this.drawVelocityVector();
    }
  
    drawVelocityVector() {
      push();
      // Dessin du vecteur vitesse
      // Il part du centre du véhicule et va dans la direction du vecteur vitesse
      strokeWeight(3);
      stroke("red");
      line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
      // dessine une petite fleche au bout du vecteur vitesse
      let arrowSize = 5;
      translate(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
      rotate(this.vel.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
      // dessin d'un point derriere le wolfMan
      if(this instanceof WolfMan) {
        push();
        fill("blue");
        noStroke();
        let pointBehind = p5.Vector.sub(this.pos, this.vel.copy().setMag(40));
        ellipse(pointBehind.x, pointBehind.y, 8, 8);
        pop();
      }
    }
    

    boundaries(bx, by, bw, bh, d) {
      let vitesseDesiree = null;
  
      const xBordGauche = bx + d;
      const xBordDroite = bx + bw - d;
      const yBordHaut = by + d;
      const yBordBas = by + bh - d;
      

        // dessin du cadre de la zone
        push();
  
        noFill();
        stroke("white");
        rect(bx, by, bw, bh);
  
        // et du rectangle intérieur avec une bordure rouge de d pixels
        stroke("red");
        rect(bx + d, by + d, bw - 2 * d, bh - 2 * d);
  
        pop();

      // si le véhicule est trop à gauche ou trop à droite
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
  
     
      
      // si on est pas près du bord (vitesse désirée nulle), on renvoie un vecteur nul
      return createVector(0, 0);
    }

    separateWolf(obstacles) {
      let separateForce = Behavior.separate(this.distanceSeparation,this,wolves);
      let avoidForce = Behavior.avoid(this,obstacles, false);
      avoidForce.mult(this.avoidWeight)
      separateForce.mult(this.separateWeight);
      this.applyForce(separateForce);
      this.applyForce(avoidForce)
   }
  }
  