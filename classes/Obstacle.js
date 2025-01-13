class Obstacle {
    constructor(x, y, r, couleur,image) {
      this.pos = createVector(x, y);
      this.r = r;
      this.color = couleur;
      this.image = image;
    }
  
    show() {
      if (this.image !== undefined) {
        imageMode(CENTER);
  
        // On regarde la direction dans laquelle le boid va :
        push();
        translate(this.pos.x, this.pos.y);
  
        // J'ai rajouté PI car l'image était à l'envers
        
        image(this.image, 0, 0, this.r, this.r);
  
        pop();
  
        return;
      } else {
        strokeWeight(this.r);
        stroke(255);
        point(this.pos.x, this.pos.y);
      }
    }
}