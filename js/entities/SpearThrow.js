game.SpearThrow = me.Entity.extend({
    init: function(x, y, settings, facing){
         this._super(me.Entity, 'init', [x, y, {
           image: "spear",
           width: 48,
           height: 48,
           spritewidth: "48",
           spriteheight: "48",
           getShape: function(){
               return (new me.Rect(0, 0, 48, 48)).toPolygon();
           }
       }]);
       //these lines of code say how fast the spear is going and the number of spears you have//
       this.alwaysUpdate = true;
       this.body.setVelocity(8, 0);
       this.attack = game.data.ability3*3;
       this.type = "spear";
       this.facing = facing
    },
    
    update: function(delta){
        if(this.facing === "left"){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
       }else{
           this.body.vel.x += this.body.accel.x * me.timer.tick;
           
       }
       
       me.collision.check(this, true, this.collideHandler.bind(this), true); 
      
       this.body.update(delta);

       this._super(me.Entity, "update", [delta]);
       return true;
    },
    
    collideHandler: function(response){
        //these lines of code say if the spear was thrown at the base or enemy creep then lose health overtime//
        if(response.b.type==='EnemyBase' || response.b.type==='EnemyCreep'){
           response.b.loseHealth(this.attack);
           me.game.world.removeChild(this);
         }
      }
    
});
