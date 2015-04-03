//############################################################## P L A Y E R  E N T I T Y #######################################################################
game.PlayerEntity = me.Entity.extend({
    //constructor
    init: function(x, y, settingd) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                //size of the image
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        this.type = "PlayerEntity";
        this.health = game.data.playerHealth;
        //velocity for player
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        //keeps track of which direction your character is going
        this.facing = "right";
        this.dead  = false; 
        this.attack = game.data.playerAttack;
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
        //wherever the player goes, the screen will follow
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

        this.renderable.setCurrentAnimation("idle");

    },
    //delta - change in time
    update: function(delta) {
        this.now = new Date().getTime();
        
        if(this.health <= 0){
            this.dead = true;
        }
        
        //check if key was pressed
        if (me.input.isKeyPressed("right")) {
            //adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick
            //by me.time.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
        } else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
            this.flipX(false);
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }


        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //Sets the current animation to attack and once that is over
                //goes back to idleanimation
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that the next time we start this sequence we begin
                //from the first animation, notwherever we left off when we
                //switched to another animation
                this.renderable.setAnimationFrame();
            }
        }



        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            //difference of my players y/x position and the bases y/x position
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            if (ydif < -40) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }

            else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
                this.body.vel.x = 0;
               // this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === 'left' && xdif > 0) {
                this.body.vel.x = 0;
               // this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        } else if (response.b.type === 'EnemyCreep') {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            if (xdif > 0) {
              //  this.pos.x = this.pos.x + 1;
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
                //this.pos.x = this.pos.x - 1;
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }


                if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                       && (Math.abs(ydif)<=40) && 
                       (((xdif>0) && this.facing === "left") || (xdif<0) && this.facing === "right")
                       ){
                    this.lastHit = this.now;
                    //if the creeps health is less then our attack , execute code in if statement
                    if(response.b.health <= game.data.playerAttack){
                        //adds one gold for a creep kill
                        game.data.gold += 1;
                    }
                    
                    response.b.loseHealth(game.data.playerAttack);
                }
            }
        }
    }
});
//############################################################## P L A Y E R  B A S E #####################################################################
game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "PlayerBase";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    onCollision: function() {

    }

});
//############################################################## E N E M Y  B A S E ###############################################################
game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");

    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function() {
        this.health--;
    },
    onCollision: function() {

    }
});
//############################################################## E N E M Y  C R E E P #####################################################################
game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function() {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
            }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //this.attacking lets us know that the enemy is attacking
        this.attacking = false;
        //keeps track of when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        //keeps track of the last time our creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);

        this.type = "EnemyCreep";

        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");

    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    update: function(delta) {
        if (this.health <= 0) {
            
            me.game.world.removeChild(this);
        }

        this.now = new Date().getTime();
        this.body.vel.x -= this.body.accel.x * me.timer.tick;

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;

    },
    collideHandler: function(response) {
        if (response.b.type === 'PlayerBase') {
            this.attacking = true;
            //this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //keeps moving th creep to the right to maintain its position
            this.pos.x = this.pos.x + 1;
            //chacks that it has been at least 1 second since this creep hit a base 
            if ((this.now - this.lastHit >= 1000)) {
                //updates the lastHit timer
                this.lastHit = this.now;
                //makes the player basse call its lostHealth function and passes
                //damage of 1
                response.b.loseHealth(game.data.enemyCreepHealth);
            }
        } else if (response.b.type === 'PlayerEntity') {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            if (xdif > 0) {
                this.pos.x = this.pos.x = 1;
                if (this.facing === "left") {
                    this.vel.x = 0;
                }
            } else {
                this.pos.x = this.pos.x - 1;
                if (this.facing === "right") {
                    this.vel.x = 0;
                }
            }

            this.attacking = true;
            //this.lastAttacking = this.now;
            if (xdif > 0) {
                //keeps moving th creep to the right to maintain its position
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            //chacks that it has been at least 1 second since this creep hit something
            if ((this.now - this.lastHit >= 1000) && xdif > 0) {
                //updates the lastHit timer
                this.lastHit = this.now;
                //makes the player call its lostHealth function and passes
                //damage of 1
                response.b.loseHealth(game.data.enemyCreepAttackTimer);
            }
        }
    }

});
//############################################################## G A M E  M A N A G E R #########################################################################
game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        
        if(game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
            if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)) {
                game.data.gold += 1;
        }
        
        
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
        return true;
    }

});