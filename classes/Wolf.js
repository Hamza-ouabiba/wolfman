class Wolf extends Character {
   constructor(x,y,color,name,angle,vitesse,tempsMinEntreTirsEnMillisecondes) {
      let wolf =  loadImage("assets/wolf.jpg");
      super(x,y,color,name,wolf)
      this.fireballs = [];
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.v = vitesse;
      // cadenceTir en millisecondes = temps min entre tirs
      this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
   }

   addFireBall(time) {
      // si le temps écoulé depuis le dernier tir est > temps max alors on tire
      var tempEcoule=0;
      
      if(this.lastFireBallTime !== undefined) {
        tempEcoule = time - this.lastFireBallTime;
        //console.log("temps écoulé = " + tempEcoule);
      }
      
      if((this.lastFireBallTime === undefined) || (tempEcoule> this.delayMinBetweenBullets)) {
         let fireball = new FireBall(this);
         this.fireballs.push(fireball);
         // on mémorise le dernier temps.
         this.lastFireBallTime = time;
      }
    }
 
    removeBullet(fireBall) {
         let position = this.fireballs.indexOf(fireBall);
         this.bullets.splice(position, 1);
   }
}
  