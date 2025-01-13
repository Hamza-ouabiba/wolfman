class Bullet extends Character {
    constructor(char) {
        super(char.pos.x, char.pos.y, "lightgreen", "bullet");
        this.xx = char.pos.x;
        this.yy = char.pos.y;
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
