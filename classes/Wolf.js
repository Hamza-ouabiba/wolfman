class Wolf extends Character {
   constructor(x,y,color,name,angle,vitesse,tempsMinEntreTirsEnMillisecondes,image) {
      super(x,y,color,name,image)
      this.bullets = [];
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.v = vitesse;
      this.bullets = [];
      // cadenceTir en millisecondes = temps min entre tirs
      this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
   }

   addBullet(time) {
      // si le temps écoulé depuis le dernier tir est > temps max alors on tire
      var tempEcoule=0;
      
      if(this.lastBulletTime !== undefined) {
        tempEcoule = time - this.lastBulletTime;
        //console.log("temps écoulé = " + tempEcoule);
      }
      
      if((this.lastBulletTime === undefined) || (tempEcoule> this.delayMinBetweenBullets)) {
         let bullet = new Bullet(this);
         this.bullets.push(bullet);
         // on mémorise le dernier temps.
         this.lastBulletTime = time;
      }
    }
 
    removeBullet(bullet) {
         let position = this.bullets.indexOf(bullet);
         this.bullets.splice(position, 1);
   }
}
  