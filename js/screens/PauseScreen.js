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
        //this keeps the game always updating so that it doesn't lag//
        this.now = new Date().getTime();
        //this says if the "pause" button which is "P" is pressed then pause//
        if(me.input.isKeyPressed("pause") && this.now-this.lastBuy >=1000){
            console.log("pause");
            this.lastBuy = this.now;
            //this says if not buying then pause the game
            if(!this.buying){
                this.startPausing();
                //this if pausing then start pausing//
            }else{
                this.stopPausing();
            }
            
        }
        
        return true;
    },
    
    startPausing: function(){
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        //this is the image that pops up when the game is paused//
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('pause-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        //this keeps the player stay in place when the game is paused//
        game.data.player.body.setVelocity(0, 0);
        me.state.pause(me.state.PLAY);
        this.setPauseText();
    },
    
    setPauseText: function(){
        game.data.buytext = new (me.Renderable.extend({
                    init:function(){
                        this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                        this.font = new me.Font("Arial", 40, "black");
                        //this line of code keeps the game paused and updating while being paused
                        this.updateWhenPaused = true;
                        this.alwaysUpdate = true;
                    },
                    
                        draw: function(renderer){
                            //this is the "Pause" text and location of the pause font//
                            this.font.draw(renderer.getContext(), "PRESS P To Resume Game", this.pos.x, this.pos.y);
                        }
                    
                }));
        me.game.world.addChild(game.data.buytext, 35);        
    },
    
    stopPausing: function(){
         this.buying = false;
         //when the game is in pause state and wanting to resume back to play "STATE"//
         me.state.resume(me.state.PLAY);
         game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
         me.game.world.removeChild(game.data.buyscreen);
         me.game.world.removeChild(game.data.buytext);
    }
    
});