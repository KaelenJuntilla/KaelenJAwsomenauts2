
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
    init:function(x, y, settings){
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
    
    update: function(){
        this.now = new Date().getTime();
        
        if(me.input.isKeyPressed("pause") && this.now-this.lastBuy >=1000){
            this.lastBuy = this.now;
            if(!this.buying){
                this.startBuying();
            }else{
                this.stopBuying();
            }
            
        }
        
        return true;
    },
    
    startBuying: function(){
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('pause-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.state.pause(me.state.PLAY);
        me.input.bindKey(me.input.KEY.P, "P", true);
        this.setBuyText();
    },
    
    setBuyText: function(){
        game.data.buytext = new (me.Renderable.extend({
                    init:function(){
                        this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                        this.font = new me.Font("Arial", 26, "white");
                        this.updateWhenPaused = true;
                        this.alwaysUpdate = true;
                    },
                    //these are the things you can buy at the beginning of the game//
                        draw: function(renderer){
                            this.font.draw(renderer.getContext(), "PRESS P To Resume Game", this.pos.x, this.pos.y);
                        }
                    
                }));
        me.game.world.addChild(game.data.buytext, 35);        
    },
    
    stopBuying: function(){
         this.buying = false;
         me.state.resume(me.state.PLAY);
         game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
         me.game.world.removeChild(game.data.buyscreen);
         me.game.world.removeChild(game.data.buytext);
    }
    
});