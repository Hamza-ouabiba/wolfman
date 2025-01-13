class FireBall extends Character {
    constructor(wolf) {
        let fireball =  loadImage("assets/fireball.png");
        super(wolf.pos.x, wolf.pos.y, "lightgreen", "bullet",fireball);
        this.xx = wolf.pos.x;
        this.yy = wolf.pos.y;
    }
    // voir si le missile a touché la cible
    // si oui on retourne true
    // sinon on retourne false
    hit(target) {
        let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (d < target.r) {
            return true;
        }
        return false;
    }

    move(target) {
        console.log("target = " + target);
            let seekForce = Behavior.seek(this, target.pos);
            seekForce.mult(this.seekWeight);
            this.applyForce(seekForce);
    }
}
