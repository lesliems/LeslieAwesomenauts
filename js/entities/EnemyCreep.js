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
        //setting the enemy creeps's animation
        this.type = "EnemyCreep";
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");

    },
    //the current health minus the damage it took
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    //if the health is less than or equal to 0 the character will be removed
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
            if (((this.now - this.lastHit) >= 1000) && xdif > 0) {
                //updates the lastHit timer
                this.lastHit = this.now;
                //makes the player call its lostHealth function and passes
                //damage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }

});



