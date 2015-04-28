game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        this.addAnimation();

        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                //the sprite width and height is the size of the image, the width and the height tells the screen how much space to preserve//
                spriteWidth: "64",
                spriteHeight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
    },
    
    setPlayerTimers: function(){
        this.now = new Date().getTime();
        //this keeps track of the last hit//
        this.lastHit = this.now;
        this.lastSpear = this.now;
        //this keeps track of the last time a creep hit something//
        this.lastAttack = new Date().getTime(); //haven't used this
    },
    
    setAttributes: function(){
        //these are the attributes of the player//
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
        //Keeps track of which direction your is going//
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
    },
    
    addAnimation: function(){
        //these are the animations for the player//
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    
    update: function(delta){
        this.now = new Date().getTime();
        //this checks if the player has died//
        this.dead = this.checkIfDead();
        //this checks if the keys were pressed//
        this.checkKeyPressesAndMove();
        //this checks if the ability keys were pressed//
        this.checkAbilityKeys();
        this.setAnimation();
        //this checks if we have collided into anything//
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    //this checks if the player has died//
    checkIfDead: function(){
      if(this.health <= 0 ){
            return true;
            this.pos.x = 10;
            this.pos.y = 0;
            this.health = game.data.playerHealth;
        }  
        return false;
    },
    //this checks if any keys were pressed then move in that direction of which the key does//
    checkKeyPressesAndMove: function(){
      if (me.input.isKeyPressed("right")) {
            this.moveRight();
        }else if(me.input.isKeyPressed("left")){
            this.moveLeft();
        }else{
            this.body.vel.x = 0;
        }
        
        if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.falling){
            this.jump();
        }  
        
      this.attacking = me.input.isKeyPressed("attack");
    },
    
    moveRight: function(){
      //adds to the postition of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);  
    },
    //this is the jump function//
    jump: function(){
      this.body.jumping = true;
      this.body.vel.y -= this.body.accel.y * me.timer.tick;  
    },
    //this is the moveleft function//
    moveLeft: function(){
        this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
    },
    //these are the ability keys that are in the buy menu//
    checkAbilityKeys: function(){
        if(me.input.isKeyPressed("skill1")){
            
        }else if(me.input.isKeyPressed("skill2")){
            
        }
        else if(me.input.isKeyPressed("skill3")){
            this.throwSpear();
        }
    },
    //this is my throw spear function//
    throwSpear: function(){
        if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0){
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    
    setAnimation: function(){
        if(this.attacking){
            if(!this.renderable.isCurrentAnimation("attack")){
                //Sets the current Animation to attack and once that is over
                //goes back to the idle animation//
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we switched to another animation//
                this.renderable.setAnimationFrame();
            }
        }
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
            //this says if not attacking then reset back to idle state//
        }else if (!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }
    },
    //this is the lose health function for when my player is attacked//
    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    //these lines of code lets us attack the enemy base and creeps//
    collideHandler: function(response){
        if(response.b.type==='EnemyBaseEntity'){
            this.collideWithEnemyBase(response);
        }else if(response.b.type==='EnemyCreep'){
                this.collideWithEnemyCreep(response);
        }
    },
    //this doesnt let us go threw the base//
    collideWithEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x -response.b.pos.x;
            
             if(ydif<-40 && xdif< 70 && xdif>-35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if(xdif>-35 && this.facing==='right' && (xdif<0)){
               this.body.vel.x = 0;
            }else if(xdif<70 && this.facing==='left' && xdif>0){
                this.body.vel.x = 0;
                
            }
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
    },
    
    collideWithEnemyCreep: function(response){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            //this stops the movement if colliding with the creep//
            this.stopMovement(response);
            
            if(this.checkAttack(xdif, ydif)){
               this.hitCreep(response);
            };
            
            
    },
    
    stopMovement: function(xdif){
          if (xdif>0){
                if(this.facing==="left"){
                    this.body.vel.x = 0;
                }
            }else{
                if(this.facing==="right"){
                    this.body.vel.x = 0;
                }
            }
    },
    
    checkAttack: function(xdif, ydif){
         if(this.renderable.isCurrentAnimation("attack") && (this.now-this.lastHit) >= game.data.playerAttackTimer
                    && (Math.abs(ydif)  <=40) && 
                    (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))  
                    ){
                this.lastHit = this.now;
                //if the creeps health is less than our attack, execute code in this if statemaent
                 return true;
        }
        return false;
    },
    
    hitCreep: function(response){
        if(response.b.health <= game.data.playerAttack){
                    //adds one gold for a creep kill//
                    game.data.gold += 1;
                    console.log("Current gold: " + game.data.gold);
                }
                //this says if the creep is attacked then lose health overtime//
                response.b.loseHealth(game.data.playerAttack);
    }
});