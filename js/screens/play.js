game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                //teliing it what to look at as far as maps
                me.levelDirector.loadLevel("level101");
                
                this.resetPlayer(0, 420);
                
                //pulling the player and setiing where he will show up
                var player = me.pool.pull("player", 0, 420, {});
                var gamemanager = me.pool.pull("GameManager", 0, 0, {});
                //adding the player to the world
                me.game.world.addChild(player, 5);
                me.game.world.addChild(gamemanager, 0);
                
                //bind key for movement
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.LEFT, "left");
                me.input.bindKey(me.input.KEY.SPACE, "jump");
                me.input.bindKey(me.input.KEY.A, "attack");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},
        
        resetPlayer: function(x, y){
             //pulling the player and setiing where he will show up
                game.data.player = me.pool.pull("player", x, y, {});
                me.game.world.addChild(game.data.player, 5);
        }
});
