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
          // augmentation du score : 
          this.wolfMan.score += 10;
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


    creerUnSlider(label, tab, min, max, val, step, posX, posY, propriete) {
        let slider = createSlider(min, max, val, step);


        let labelP = createP(label);
        labelP.position(posX, posY);
        labelP.style('color', 'white');
      
        slider.position(posX + 150, posY + 17);
      
        let valueSpan = createSpan(slider.value());
        valueSpan.position(posX + 300, posY+17);
        valueSpan.style('color', 'white');
        valueSpan.html(slider.value());
      
        slider.input(() => {
          valueSpan.html(slider.value());
          tab.forEach(w => {
            w[propriete] = slider.value();
          });
        });
      
        return slider;
      }
      
    creerSliderNbVehicules(x, y, textLabel, min, max, value, step) {
        // On cree un slider pour changer la vitesse max des vehicules
        // on ajoute un label pour le slider
        let label = createP(textLabel + " : ");
        // couleur blanche
        label.style('color', 'white');
        // on le positionne avant le slider
        let labelX = x;
        let labelY = y;
        label.position(labelX, labelY);
        let slider = createSlider(min, max, value, step);
        slider.position(labelX + 150, labelY + 18);
        // On affiche la valeur du slider à droite du slider
        let sliderValue = createP(slider.value());
        // couleur blanche
        sliderValue.style('color', 'white');
        sliderValue.position(labelX + 300, labelY+2);
      
        slider.input(() => {
          // on met à jour la valeur du label
          sliderValue.html(slider.value());
          
          // On remet à 0 le tableau des vehicules
          this.wolves = [];
          //... et on en recrée
          this.creerLoups(slider.value());
        });
     }

    creerLoups(nbVehicules) {
        for (let i = 0; i < nbVehicules; i++) {
          this.wolves.push(new Wolf(random(width), random(height), "red", "wolf 3", 0, 1, 700));
          // on met une valeur randoml pour la vitesse max
          this.wolves[i].maxSpeed = random(0.5, 6);
          // idem pour la force max
          this.wolves[i].maxForce = random(0.1, 2);
        }
    }

    affichageScore() {
        push();
        fill('yellow'); // Couleur du texte
        textSize(32); // Taille du texte
        textAlign(RIGHT, TOP); // Alignement du texte
        text(`Score: ${this.wolfMan.score}`, width - 50, 15); // Afficher le score en haut à droite
        pop();
    }

    instructions() {
        return alert("Instructions\n\n" +
            "- E - Afficher un ennemi en tirant dessus par des fireballs\n" +
            "- S - Afficher le mode Snake\n" +
            "- L - Afficher le mode Leader\n" +
            "- N - Afficher le mode Normal\n" +
            "- W - Ajouter un Wolf \n" +
            "- R - Appuyez sur 'R' pour redémarrer le jeu\n\n" +
            "Concept du jeu :\n" +
            "- Les wolves peuvent tirer des fireballs sur Arthur pour marquer 10 points.\n" +
            "- Si Arthur vous attrape (wolfMan), vous perdez la partie. \n" + 
            "- Pour s'échapper il faut jouer avec la souris !!!!");
    }
}