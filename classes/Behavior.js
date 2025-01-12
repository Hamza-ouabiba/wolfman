class Behavior {
    constructor() {
      
    }
    static arrive(target, d=0) {
        return this.seek(target, true, d);
    }


    static seek(object,target, arrival=false, d=0) {
        let desiredSpeed = p5.Vector.sub(target, object.pos);
        let desiredSpeedMagnitude = object.maxSpeed;
    
        if (arrival) {
          const dist = p5.Vector.dist(object.pos, target);
    
          if (dist < object.rayonZoneDeFreinage) {
            desiredSpeedMagnitude = map(dist, d, object.rayonZoneDeFreinage, -3, object.maxSpeed)
          }
        }
    
        desiredSpeed.setMag(desiredSpeedMagnitude);
        let force = p5.Vector.sub(desiredSpeed, object.vel);
        force.limit(object.maxForce);
        return force;
    }

    static flee(object,target) {
       return this.seek(object,target).mult(-1);
    }


  static separate(distanceSeparation,current,boids) {
    let desiredseparation = distanceSeparation;
    let steer = createVector(0, 0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = p5.Vector.dist(current.pos, other.pos);
      if (d > 0 && d < desiredseparation) {
        let diff = p5.Vector.sub(current.pos, other.pos);
        diff.normalize();
        diff.div(d); 
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(current.maxSpeed);
      steer.sub(current.vel);
      steer.limit(current.maxForce);
    } 
    return steer;
  }

  static getObstacleLePlusProche(current,obstacles) {
    let plusPetiteDistance = 100000000;
    let obstacleLePlusProche = undefined;

    obstacles.forEach(o => {
      const distance = current.pos.dist(o.pos);

      if (distance < plusPetiteDistance) {
        plusPetiteDistance = distance;
        obstacleLePlusProche = o;
      }
    });

    return obstacleLePlusProche;
  }

  static avoid(current,obstacles, considereVehiculesCommeObstacles = false) {
    let force;
    // On calcule un pointdevant le véhicule courant
    // on l'appelle ahead
    // et on le postionne à une distance this.distanceAhead devant le véhicule
    let ahead = current.vel.copy();
   // ahead.normalize();
    ahead.mult(current.distanceAhead);

    // on prend un point ahead2 au milieu
    let ahead2 = ahead.copy();
    ahead2.mult(0.5);

    // On prend ahead3 = la position du vaisseau
    let ahead3 = ahead2.copy();
    ahead3.mult(0.5);

    // if (Character.debug) {
    //   // on dessine le vecteur ahead en jaune
    //   current.drawVector(current.pos, ahead, "yellow");
    // }
    // Pour le dessiner, il faut lui ajouter la position du véhicule
    ahead.add(current.pos);
    ahead2.add(current.pos);
    ahead3.add(current.pos);

    // if (Character.debug) {
    //   // on le dessine en rouge
    //   fill("red");
    //   circle(ahead.x, ahead.y, 10);

    //   fill("lightblue");
    //   circle(ahead2.x, ahead2.y, 15);

    //   fill("pink");
    //   circle(ahead3.x, ahead3.y, 20);
    // }

    // On cherche l'obstacle le plus proche
    let obstacleLePlusProche = this.getObstacleLePlusProche(current,obstacles);

    // On calcule la distance entre la position de l'obstacle le plus proche
    // et le point ahead
    let distance1 = ahead.dist(obstacleLePlusProche.pos);
    let distance2 = ahead2.dist(obstacleLePlusProche.pos);
    let distance3 = ahead3.dist(obstacleLePlusProche.pos);
    // on regarde laquelle est la plus petite
    let plusPetiteDistance = min(distance1, distance2);
    plusPetiteDistance = min(plusPetiteDistance, distance3);


    // si distance < rayon de l'obstacle + rayon du véhicule
    // Alors il y a collision possible, on calcule la force d'évitement
    if (plusPetiteDistance < obstacleLePlusProche.r + current.r / 2) {
      // collision possible, on calcule le vecteur qui va 
      // du centre de l'obstacle jusqu'au point ahead, il représente
      // la direction dans laquelle on doit aller pour éviter l'obstacle
      // c'est la  vitesse désirée ?
      let desiredSpeed;
      if(plusPetiteDistance == distance1){
        desiredSpeed = p5.Vector.sub(ahead, obstacleLePlusProche.pos);
      } else if(plusPetiteDistance == distance2){
        desiredSpeed = p5.Vector.sub(ahead2, obstacleLePlusProche.pos);
      } else {
        desiredSpeed = p5.Vector.sub(ahead3, obstacleLePlusProche.pos);
      }

      // if (Character.debug) {
      //   // On dessine ce vecteur qui part du centre de l'obstacle
      //   // et va vers le point ahead
      //   current.drawVector(obstacleLePlusProche.pos, desiredSpeed, "yellow");
      // }

      // on calcule la force
      // 1 - on met desiredSpeed au maximum
      desiredSpeed.setMag(current.maxSpeed);
      
      // 2 - formule magique : force = vitesse desiree - vitesse actuelle
      force = p5.Vector.sub(desiredSpeed, current.vel);
      // on la limite
      force.limit(current.maxForce);

      // et on la renvoie
      return force;
    } else {
      // pas de collision possible
      force = createVector(0, 0);
    }
      return force;
    //}

    return createVector(0, 0);

  }
 
  static pursue(target) { 
    let prediction = target.vel.copy();
    prediction.mult(10);

    prediction.add(target.pos);

    return this.seek(prediction);
  }

  static evade(target) {
    return this.pursue(target).mult(-1);
  }

  
}