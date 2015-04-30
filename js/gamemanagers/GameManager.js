game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    update: function() {
        // if i win the game (if true) and is not game over 
        //then you win if not you lose
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
            alert("YOU WIN!");
        } else if (game.data.win === false && !this.gameover) {
            this.gameOver(false);
            alert("YOU LOSE!");
        }
        return true;
    },
    gameOver: function(win) {
        //if you win then 10 exp  will be added to your current exp
        // otherwise you will only gain 1 exp
        if (win) {
            game.data.exp += 10;
        } else {
            game.data.exp += 1;
        }
 
        this.gameover = true;
        // saving your exp
        me.save.exp = game.data.exp;

        $.ajax({
            type: "POST",
            url: "php/controller/save-user.php",
            data: {
             exp: game.data.exp,
              exp1: game.data.ex1p,
               exp2: game.data.ex2p,
                exp3: game.data.exp3,
                 exp4: game.data.exp4,

            },
            //send back a msg saying weather it did or not go through the php code or not
            dataType: "text"
        })
                .success(function(response) {
                    //if true it will give us something
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    } else {
                        //if an error it will give a response
                        alert(response);
                    }
                })
                //if it fails it will sy alert
                .fail(function(response) {
                    alert("Fail");
                });


    }

});


