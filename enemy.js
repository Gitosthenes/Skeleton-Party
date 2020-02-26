function Enemy(game, spriteSheet, speed, animationType, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight) {
    this.name = name;
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

        if(this.isAttacking && this.currAnimation.elapsedTime > animationDelay) this.activateHurtbox();
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

Enemy.prototype.activateHurtbox = function () {
    // TODO: Make activateHurtbox from the collisions file an enemy entity function.
    // TODO: Add new hurtbox constructor to this.
    switch (this.direction.toLowerCase()) {
        case 'down':
            this.hurtbox.x = (this.x - this.hurtbox.downXOffset);
            this.hurtbox.y = (this.y + this.hurtbox.downYOffset);
            this.hurtbox.height = this.hurtbox.verticalHeight;
            this.hurtbox.width = this.hurtbox.verticalWidth;
            this.hurtbox.top = this.hurtbox.y;
            this.hurtbox.bottom = this.hurtbox.y + this.hurtbox.height;
            this.hurtbox.left = this.hurtbox.x;
            this.hurtbox.right = this.hurtbox.x + this.hurtbox.width;
            break;
        case 'up':
            this.hurtbox.x = (this.x - this.hurtbox.upXOffset);
            this.hurtbox.y = this.y;
            this.hurtbox.height = this.hurtbox.verticalHeight;
            this.hurtbox.width = this.hurtbox.verticalWidth;
            this.hurtbox.top = this.hurtbox.y;
            this.hurtbox.bottom = this.hurtbox.y + this.hurtbox.height;
            this.hurtbox.left = this.hurtbox.x;
            this.hurtbox.right = this.hurtbox.x + this.hurtbox.width;
            break;
        case 'left':
            this.hurtbox.x = this.x - this.hurtbox.leftXOffset;
            this.hurtbox.y = this.y + this.hurtbox.leftYOffset;
            this.hurtbox.height = this.hurtbox.horizontalHeight;
            this.hurtbox.width = this.hurtbox.horizontalWidth;
            this.hurtbox.top = this.hurtbox.y;
            this.hurtbox.bottom = this.hurtbox.y + this.hurtbox.height;
            this.hurtbox.left = this.hurtbox.x;
            this.hurtbox.right = this.hurtbox.x + this.hurtbox.width;
            break;
        case 'right':
            this.hurtbox.x = this.x + this.hurtbox.rightXOffset;
            this.hurtbox.y = this.y + this.hurtbox.rightYOffset;
            this.hurtbox.height = this.hurtbox.horizontalHeight;
            this.hurtbox.width = this.hurtbox.horizontalWidth;
            this.hurtbox.top = this.hurtbox.y;
            this.hurtbox.bottom = this.hurtbox.y + this.hurtbox.height;
            this.hurtbox.left = this.hurtbox.x;
            this.hurtbox.right = this.hurtbox.x + this.hurtbox.width;
            break;
    }
};

function MaleKnightSpear(game,spritesheet) {
    Enemy.call(game, spritesheet, 200, 2, 18, 10, 30, 55);
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
    console.log("Spear spawn X: " + this.x + " Y: " + this.y);

    // this.enemyHP = 1000;
    // this.x = this.relativeX = 0;
    // this.y = this.relativeY = 0;
    // this.hitboxOffsetX = 18;
    // this.hitboxOffsetY = 10;
    // this.safeDist = 63;
    // this.speed = 200;
    // this.game = game;
    // this.ctx = game.ctx;
    // this.isAttacking = false;
    // this.isRecoiling = false;
    // this.direction = 'Down';
    // this.state = "walkDown";
    // this.attAnimationSpeed = 0.12;
    // entityAnimationInit(this, spritesheet, 2);
    // this.currAnimation = this.animations[this.state];
    // setEnemyRandomLocation(this);
    // console.log("Spear spawn X " + this.x + "Y " + this.y);
    // Entity.call(game, this.x, this.y, undefined);
    // this.hitbox = new Hitbox(this.x, this.y, 55, 30, true);
    // this.hurtbox = new Hitbox(0, 0, 0, 0, false);
}

MaleKnightSpear.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

MaleKnightSpear.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

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
    Enemy.prototype.update.call(this);
};

MaleKnightMace.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};
