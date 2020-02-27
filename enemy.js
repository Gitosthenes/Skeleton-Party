function Enemy(game, spriteSheet, speed, animationType, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight) {
    this.removeFromWorld = false;
    this.game = game;
    this.ctx = game.ctx;
    this.enemyHP = 1000;
    this.isAttacking = false;
    this.isRecoiling = false;
    this.hitboxOffsetX = hitboxOffsetX;
    this.hitboxOffsetY = hitboxOffsetY;
    this.baseSpeed = speed;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.direction = 'Down';
    this.state = "walkDown";
    this.safeDist = 63;
    this.attAnimationSpeed = 0.12;
    entityAnimationInit(this, spriteSheet, spriteSheet, animationType);
    this.currAnimation = this.animations[this.state];
    this.hitbox = new Hitbox(this.x, this.y, hitboxHeight, hitboxWidth, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
    let padding = 80;
    this.x = this.relativeX = Math.floor(Math.random() * (((800 * 2.5) - this.currAnimation.frameWidth - padding) - padding + 1)) + padding;
    this.y = this.relativeY = Math.floor(Math.random() * (((800 * 2.5) - this.currAnimation.frameWidth - padding) - padding + 1)) + padding;
    // this.x = this.relativeX = 200
    // this.y = this.relativeY = 200
}

Enemy.prototype.update = function() {
    if(!ON_TITLESCREEN) {
        // console.log(this.x + ', ' + this.y)
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
        // if(this.hitByTerrain) {
        //     // console.log(this.prototype);
        //     this.x += this.game.clocktick * this.xSpeed;
        //     this.relativeX += this.game.clocktick * this.xSpeed;
        //     this.y += this.game.clocktick * this.ySpeed;
        //     this.relativeY += this.game.clocktick * this.ySpeed;
        // }
    }
    Entity.prototype.update.call(this);
};

Enemy.prototype.draw = function() {
    if(!ON_TITLESCREEN && !GAME_OVER) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

function activateHurtbox(entity) {
    // TODO: Make activateHurtbox from the collisions file an enemy entity function.
    // TODO: Add new hurtbox constructor to this.
    entity.hurtbox.isActive = true;
    switch (entity.direction.toLowerCase()) {
        case 'down':
            entity.hurtbox.x = (entity.x - entity.hurtbox.downXOffset);
            entity.hurtbox.y = (entity.y + entity.hurtbox.downYOffset);
            entity.hurtbox.height = entity.hurtbox.verticalHeight;
            entity.hurtbox.width = entity.hurtbox.verticalWidth;
            entity.hurtbox.top = entity.hurtbox.y;
            entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
            entity.hurtbox.left = entity.hurtbox.x;
            entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
            break;
        case 'up':
            entity.hurtbox.x = (entity.x - entity.hurtbox.upXOffset);
            entity.hurtbox.y = entity.y;
            entity.hurtbox.height = entity.hurtbox.verticalHeight;
            entity.hurtbox.width = entity.hurtbox.verticalWidth;
            entity.hurtbox.top = entity.hurtbox.y;
            entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
            entity.hurtbox.left = entity.hurtbox.x;
            entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
            break;
        case 'left':
            entity.hurtbox.x = entity.x - entity.hurtbox.leftXOffset;
            entity.hurtbox.y = entity.y + entity.hurtbox.leftYOffset;
            entity.hurtbox.height = entity.hurtbox.horizontalHeight;
            entity.hurtbox.width = entity.hurtbox.horizontalWidth;
            entity.hurtbox.top = entity.hurtbox.y;
            entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
            entity.hurtbox.left = entity.hurtbox.x;
            entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
            break;
        case 'right':
            entity.hurtbox.x = entity.x + entity.hurtbox.rightXOffset;
            entity.hurtbox.y = entity.y + entity.hurtbox.rightYOffset;
            entity.hurtbox.height = entity.hurtbox.horizontalHeight;
            entity.hurtbox.width = entity.hurtbox.horizontalWidth;
            entity.hurtbox.top = entity.hurtbox.y;
            entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
            entity.hurtbox.left = entity.hurtbox.x;
            entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
            break;
    }
};

function MaleKnightSpear(game,spritesheet) {
    Enemy.call(this, game, spritesheet, 200, 2, 18, 10, 30, 55);
    let hbHorWidth = 50;
    let hbHorHeight = 30;
    let hbVertWidth = 20;
    let hbVertHeight = 40;
    let hbUpXOff = 5;
    let hbUpYOff = 30;
    let hbDownXOff = 5;
    let hbDownYOff = 45;
    let hbLeftXOff = 22;
    let hbLeftYOff = 23;
    let hbRightXOff = 40;
    let hbRightYOff = 23;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
                                hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

MaleKnightSpear.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

MaleKnightSpear.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

function MaleKnightMace(game, spritesheet) {
    Enemy.call(this, game, spritesheet, 200, 2, 18, 10, 30, 55);
    let hbHorWidth = 50;
    let hbHorHeight = 30;
    let hbVertWidth = 20;
    let hbVertHeight = 40;
    let hbUpXOff = 5;
    let hbUpYOff = 30;
    let hbDownXOff = 5;
    let hbDownYOff = 45;
    let hbLeftXOff = 22;
    let hbLeftYOff = 23;
    let hbRightXOff = 40;
    let hbRightYOff = 23;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

MaleKnightMace.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

MaleKnightMace.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};
