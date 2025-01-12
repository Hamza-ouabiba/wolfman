class WolfMan extends Character {
    constructor(x,y,color,name) {
        super(x,y,color,name)
        this.sightRadius = 40;
    }
    // le point va etre l'inverse de la direction du wolfMan
    PointBehind() {
        let tv = this.vel.copy();
        tv.mult(-1);
        tv.normalize();
        tv.mult(70);
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