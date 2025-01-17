class WolfMan extends Character {
    constructor(x,y,color,name,image) {
        super(x,y,color,name,image);
        this.sightRadius = 40;
        this.score = 0;
    }
    // le point va etre l'inverse de la direction du wolfMan
    PointBehind() {
        let tv = this.vel.copy();
        tv.mult(-1);
        tv.normalize();
        tv.mult(50);
        let behind = this.pos.copy();
        behind.add(tv);
        // maintenant on dessine le point
        if(Character.debug) {
            push();
            fill("red");
            circle(behind.x, behind.y, 3);
            pop();
        }
        return behind;
    }

   
}