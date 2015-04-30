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
                this.startPausing();
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
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('pause-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.state.pause(me.state.PLAY);
        me.input.bindKey(me.input.KEY.P, "P", true);
        this.setPauseText();
    },
    
    setPauseText: function(){
        game.data.buytext = new (me.Renderable.extend({
                    init:function(){
                        this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                        this.font = new me.Font("Arial", 26, "black");
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
    
    stopPausing: function(){
         this.buying = false;
         me.state.resume(me.state.PLAY);
         game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
         me.game.world.removeChild(game.data.buyscreen);
         me.game.world.removeChild(game.data.buytext);
    }
    
});