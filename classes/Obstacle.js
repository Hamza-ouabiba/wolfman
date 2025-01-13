class Obstacle {
  constructor(x, y, r, couleur,image) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = couleur;
    this.image = image;
  }

  show() {
    // dessiner l'obstacle
    push();
    fill(this.color);
    noStroke();
    if(this.image){
      image(this.image,this.pos.x - this.r, this.pos.y - this.r, this.r*2, this.r*2);
    }
    else{
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
}