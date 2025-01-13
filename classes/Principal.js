class Principal extends Character {

    constructor(x,y,color,name,image) {
        super(x,y,color,name,image)
        this.health = 100;
        this.maxHealth = 100;
    }

    // on dessine le principal avec sa barre de vie : 
    // la barre de vie est en rouge si la vie est < 50% sinon elle est verte
    // on dessine aussi le nom du principal
    drawPri() {
        super.show();
        push();
        let w = 40;
        let h = 5;
        let x = this.pos.x - w/2;
        let y = this.pos.y - 30;
        fill("black");
        rect(x, y, w, h);
        let healthWidth = map(this.health, 0, this.maxHealth, 0, w);
        if(this.health < this.maxHealth/2) {
            fill("red");
        } else {
            fill("green");
        }
        rect(x, y, healthWidth, h);
        fill("black");
        text(this.name, this.pos.x - 10, this.pos.y - 20);
        pop();
    }

    // tester si le principal a touche le wolfMan : 
    hit(target) {
        let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if(d < this.r + target.r) {
            return true;
        }
        return false
    }
}