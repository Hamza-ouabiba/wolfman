class Behavior {
    constructor() {
      
    }
    arrive(target, d=0) {
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
        let vitesseSouhaitee = p5.Vector.sub(object.pos, target);

        vitesseSouhaitee.setMag(object.maxSpeed);
    
        let force = p5.Vector.sub(vitesseSouhaitee, object.vel);
    
        force.limit(object.maxForce);
        return force;
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
      steer.mult(current.maxspeed);
      steer.sub(current.velocity);
      steer.limit(current.maxforce);
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

  static avoid(current,obstacles) {
    let ahead = current.vel.copy();
    ahead.mult(30);
    let ahead2 = ahead.copy();
    ahead2.mult(0.5);

    if(Character.debug) {
      current.drawVector(current.pos, ahead, "yellow");
    }

    let pointAuBoutDeAhead = current.pos.copy().add(ahead);
    let pointAuBoutDeAhead2 = current.pos.copy().add(ahead2);

    let obstacleLePlusProche = this.getObstacleLePlusProche(current,obstacles);

    if (obstacleLePlusProche == undefined) {
      return createVector(0, 0);
    }

    let distance1 = pointAuBoutDeAhead.dist(obstacleLePlusProche.pos);
    let distance2 = pointAuBoutDeAhead2.dist(obstacleLePlusProche.pos);
    let distance = min(distance1, distance2);


    fill("red");
    circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
    fill("blue");
    circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);

    stroke(100, 100);
    strokeWeight(current.largeurZoneEvitementDevantVaisseau);
    line(current.pos.x, current.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);


    if (distance < obstacleLePlusProche.r + current.largeurZoneEvitementDevantVaisseau + current.r) {

      let force;
      if (distance1 < distance2) {
        force = p5.Vector.sub(pointAuBoutDeAhead, obstacleLePlusProche.pos);
      }
      else {
        force = p5.Vector.sub(pointAuBoutDeAhead2, obstacleLePlusProche.pos);
      }
      if(Character.debug) {
        current.drawVector(obstacleLePlusProche.pos, force, "yellow");
      }

      force.setMag(current.maxSpeed);
      force.sub(current.vel);
      force.limit(current.maxForce);
      return force;
    } else {
      return createVector(0, 0);
    }
  }

 
  static pursue(target) { 
    let prediction = target.vel.copy();
    prediction.mult(10);

    if (Vehicle.debug) {
      this.drawVector(target.pos, prediction, "yellow");
    }

    prediction.add(target.pos);

    if (Vehicle.debug) {
      fill(0, 255, 0);
      circle(prediction.x, prediction.y, 16);
    }

    return this.seek(prediction);
  }

  static evade(target) {
    return this.pursue(target).mult(-1);
  }

}