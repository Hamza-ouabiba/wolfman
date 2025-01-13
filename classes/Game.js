// --- Game Class ---
class Game {
    constructor() {
      this.wolves = [];
      this.obstacles = [];
      this.wolfMan = null;
      this.enemy = null;
      this.mode = "normal";
    }
  
    addWolf(wolf) {
      this.wolves.push(wolf);
    }
  
    addObstacle(obstacle) {
      this.obstacles.push(obstacle);
    }
  
    drawEntities() {
      this.wolfMan.applyBehaviors(Behavior.seek, createVector(mouseX, mouseY));
      this.wolfMan.update();
      this.wolfMan.show();
    
      this.obstacles.forEach(obstacle => obstacle.show());
  
      this.wolves.forEach((wolf, index) => {
        this.handleMode(wolf, index);
        wolf.show();
        wolf.update();
      });
  
      if (this.mode === "enemy" && this.enemy) {
        this.enemy.drawPri();
        this.enemy.applyBehaviors(Behavior.seek, this.wolfMan.pos);
        this.enemy.update();
      }
    }
  
    handleMode(wolf, index) {
      const modeHandlers = {
        snake: () => this.handleSnakeMode(wolf, index),
        normal: () => this.handleNormalMode(wolf),
        leader: () => this.handleLeaderMode(wolf),
        enemy: () => this.handleEnemyMode(wolf),
      };
      modeHandlers[this.mode]?.();
    }
  
    handleSnakeMode(wolf, index) {
      wolf.bullets = [];
      const target = index === 0 ? this.wolfMan.pos : this.wolves[index - 1].pos;
      wolf.applyBehaviors(Behavior.seek, target);
    }
  
    handleNormalMode(wolf) {
      wolf.applyBehaviors(Behavior.seek, this.wolfMan.pos);
    }
  
    handleLeaderMode(wolf) {
      const behindTarget = this.wolfMan.PointBehind();
      wolf.applyBehaviors(Behavior.seek, behindTarget);
    }

    handleEnemyMode(wolf) {
        if (!this.enemy) return; 
      
        wolf.vel = p5.Vector.sub(this.enemy.pos, wolf.pos).normalize().mult(0);
        wolf.addBullet(Date.now());
      
        for (let i = 0; i < wolf.bullets.length; i++) {
          let bullet = wolf.bullets[i];
          bullet.show();
          bullet.move(this.enemy);
          bullet.applyBehaviors();
      
          if (this.enemy.hit(this.wolfMan)) {
            console.log("wolfMan has been hit!");
            gameOver = true;
           
            return;
          }
      
          if (bullet.hit(this.enemy)) {
            wolf.removeBullet(bullet);
            this.enemy.health -= 20;
          }
      
          bullet.update();
        }
      
        if (this.enemy.health <= 0) {
          console.log("Enemy has been defeated!");
          this.resetMode();
          return;
        }
      
        wolf.vel = p5.Vector.sub(this.enemy.pos, wolf.pos).normalize().mult(0);
    }

    
    resetMode() {
      console.log("Resetting mode...");
      this.mode = "normal";
      this.enemy = null;
      this.wolves.forEach(wolf => (wolf.bullets = []));
    }
}