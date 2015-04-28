
game.ExperienceManager = Object.extend({
    init: function(x, y, settings){
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    
    update: function(){
        //this says if my enemies base was destroyed than alert that you win//
        if(game.data.win === true && !this.gameover){
           this.gameOver(true);
           alert("YOU WIN");
        }else if(game.data.win === false && !this.gameover){
            //this says if my base was destoryed than alert me that i lost//
            this.gameOver(false);
            alert("YOU LOSE");
        }
        console.log(game.data.exp);
        
        return true;
    },
    
    gameOver: function(win){
        if(win){
            game.data.exp += 10;
        }else{
            
        }
        
        game.data.exp += 10;
        this.gameover = true;
        me.save.exp = game.data.exp;
        
        
        $.ajax({
            type: "POST",
            url: "php/controller/save-user.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4,
            },
            dataType: "text"
        })
                .success(function(response) {
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    } else {
                        alert(response);
                    }
                })
                .fail(function(response) {
                    alert("FAIL");
                });


    }

});

game.PauseScreen = Object.extend({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastPaused = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.pausing = false;
    },
    
    update: function(){
        this.now = new Date().getTime();
        
        if(me.input.isKeyPressed("pause") && this.now-this.lastPause >=1000){
            this.lastPause = this.now;
            if(!this.pausing){
                this.startPausing;
            }else{
                this.stopPausing();
            }
            
        }
        
        return true;
    },
    
    startPausing: function(){
        this.pausing = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.pausescreen = new me.sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('pause-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.pausescreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
    },
    
    
    StopPausing: function(){
        this.pausing = false;
        me.state.resume(me.state.PLAY);
        game.data.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.state.world.removeChild(game.data.pausescreen);
    }
    
});