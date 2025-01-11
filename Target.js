class Target extends Vehicle {
    constructor(x, y, r) {
        super(x, y);
        this.r = r;

        // On lui donne une vitesse aléatoire
        this.vel.x = random(-10, 10);
        this.vel.y = random(-10, 10);

        // toutes les 3s, tu changes de vitesse
        setInterval(() => {
            this.vel.x = random(-10, 10);
            this.vel.y = random(-10, 10);
        }, 1000);
    }

    show() {
        // On dessine la target comme un gros cercle rose
        push();
        translate(this.pos.x, this.pos.y);

        fill("pink");
        stroke("green");
        strokeWeight(10);
        circle(0, 0, this.r * 2);
        pop();
    }
}