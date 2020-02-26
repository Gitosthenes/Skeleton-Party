function Enemy(game, spriteSheet, speed, animationType, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight) {
    this.removeFromWorld = false;
    this.ctx = game.ctx;
    this.enemyHP = 1000;
    this.isAttacking = false;
    this.isRecoiling = false;
    this.x = 0;
    this.y = 0;
    this.hitboxOffsetX = hitboxOffsetX;
    this.hitboxOffsetY = hitboxOffsetY;
    this.speed = speed;
    this.direction = 'Down';
    this.state = "walkDown";
    this.safeDist = 63;
    this.attAnimationSpeed = 0.12;
    entityAnimationInit(this, spriteSheet, animationType);
    this.currAnimation = this.animations[this.state];
    setEnemyRandomLocation(this);
    this.hitbox = new Hitbox(this.x, this.y, hitboxHeight, hitboxWidth, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
}

Enemy.prototype.update = function() {
    if(!ON_TITLESCREEN) {
        let animationDelay = this.currAnimation.totalTime / 1.8;

        updateEnemyPositionAndAnimation(this);
        updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
        updateInvincibilityFrames(this);

        if(this.isAttacking && this.currAnimation.elapsedTime > animationDelay) activateHurtbox(this);
        if(!this.isAttacking) this.hurtbox.isActive = false;
        checkForCollisions(this);

        if (this.isRecoiling && this.hitByEnemy) {
            this.enemyHP -= atk;
            if(this.enemyHP <= 0) {
                this.removeFromWorld = true;
            }
        }
    }
    Entity.prototype.update.call(this);
};

Enemy.prototype.draw = function() {
    if(!ON_TITLESCREEN && !GAME_OVER) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

function MaleKnightSpear(game,spritesheet) {

    this.enemyHP = 1000;
    this.x = this.relativeX = 0;
    this.y = this.relativeY = 0;
    this.hitboxOffsetX = 18;
    this.hitboxOffsetY = 10;
    this.safeDist = 63;
    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
    this.isAttacking = false;
    this.isRecoiling = false;
    this.direction = 'Down';
    this.state = "walkDown";
    this.attAnimationSpeed = 0.12;
    entityAnimationInit(this, spritesheet, 2);
    this.currAnimation = this.animations[this.state];
    setEnemyRandomLocation(this);
    console.log("Spear spawn X " + this.x + "Y " + this.y);
    Entity.call(game, this.x, this.y, undefined);
    this.hitbox = new Hitbox(this.x, this.y, 55, 30, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
}

MaleKnightSpear.prototype.update = function() {
    if(!ON_TITLESCREEN) {
        let animationDelay = this.currAnimation.totalTime / 1.8;

        updateEnemyPositionAndAnimation(this);
        updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
        updateInvincibilityFrames(this);

        if(this.isAttacking && this.currAnimation.elapsedTime > animationDelay) activateHurtbox(this);
        if(!this.isAttacking) this.hurtbox.isActive = false;
        checkForCollisions(this);

        if (this.isRecoiling && this.hitByEnemy) {
            this.enemyHP -= atk;
            if(this.enemyHP <= 0) {
                this.removeFromWorld = true;
            }
        }
    }
    Entity.prototype.update.call(this);
}

MaleKnightSpear.prototype.draw = function() {
    if(!ON_TITLESCREEN && !GAME_OVER) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
}

function MaleKnightMace(game, spritesheet) {

    this.enemyHP = 1000;
    this.enemyAttack= 1;
    this.x = this.relativeX = 850;
    this.y = this.relativeY = 80;
    this.hitboxOffsetX = 18;
    this.hitboxOffsetY = 10;
    this.safeDist = 60;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
    this.isAttacking = false;
    this.isRecoiling = false;
    this.direction = 'Down';
    this.state = "walkDown";

    this.attAnimationSpeed = 0.17;
    entityAnimationInit(this, spritesheet, 1);
    this.currAnimation = this.animations[this.state];
    setEnemyRandomLocation(this, this.currAnimation.frameWidth);
    Entity.call(game, this.x, this.y, undefined);
    this.hitbox = new Hitbox(this.x, this.y, 60, 40, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
}

MaleKnightMace.prototype.update = function() {
    if(!ON_TITLESCREEN) {
        let animationDelay = this.currAnimation.totalTime / 1.8;

        updateEnemyPositionAndAnimation(this);
        updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
        updateInvincibilityFrames(this);

        if(this.isAttacking && this.currAnimation.elapsedTime > animationDelay) activateHurtbox(this);
        if(!this.isAttacking) this.hurtbox.isActive = false;
        checkForCollisions(this);

        if (this.isRecoiling && this.hitByEnemy) {
            this.enemyHP -= atk;
            if(this.enemyHP <= 0) {
                this.removeFromWorld = true;
            }
        }
    }
    Entity.prototype.update.call(this);
};

MaleKnightMace.prototype.draw = function() {
    if(!ON_TITLESCREEN && !GAME_OVER) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};
