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
    this.attAnimationSpeed = 0.07;
    entityAnimationInit(this, spriteSheet, spriteSheet, animationType);
    this.currAnimation = this.animations[this.state];
    this.hitbox = new Hitbox(this.x, this.y, hitboxHeight, hitboxWidth, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
    let padding = 80;
    this.x = this.relativeX = Math.floor(Math.random() * (((800 * 2.5) - this.currAnimation.frameWidth - padding) - padding + 1)) + padding;
    this.y = this.relativeY = Math.floor(Math.random() * (((800 * 2.5) - this.currAnimation.frameWidth - padding) - padding + 1)) + padding;
}

Enemy.prototype.update = function() {
    if(!this.game.onTitleScreen) {
        // console.log(this.x + ', ' + this.y)
        let animationDelay = this.currAnimation.totalTime / 1.8;

        updateEnemyPositionAndAnimation(this);
        updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
        updateRecoilFrames(this);

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
    if(!this.game.onTitleScreen && !this.game.gameOver) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

function activateHurtbox(entity) {
    entity.hurtbox.isActive = true;
    switch (entity.direction.toLowerCase()) {
        case 'down':
            entity.hurtbox.x = (entity.x + entity.hurtbox.downXOffset);
            entity.hurtbox.y = (entity.y + entity.hurtbox.downYOffset);
            entity.hurtbox.height = entity.hurtbox.verticalHeight;
            entity.hurtbox.width = entity.hurtbox.verticalWidth;
            entity.hurtbox.top = entity.hurtbox.y;
            entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
            entity.hurtbox.left = entity.hurtbox.x;
            entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
            break;
        case 'up':
            entity.hurtbox.x = (entity.x + entity.hurtbox.upXOffset);
            entity.hurtbox.y = entity.y - entity.hurtbox.upYOffset;
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

function PlaceHolderEnemy(game, spritesheet) {
    Enemy.call(this, game, spritesheet, 200, 1, 0, 0, 0, 0);
    this.hurtbox = new Hurtbox(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

PlaceHolderEnemy.prototype.update = function () {};
PlaceHolderEnemy.prototype.draw = function () {};

function MaleKnightSpear(game,spritesheet) {
    let animType = 2;
    Enemy.call(this, game, spritesheet, 200, animType, 24, 14, 18, 34);
    let hbHorWidth = 46;
    let hbHorHeight = 12;
    let hbVertWidth = 12;
    let hbVertHeight = 40;
    let hbUpXOff = 28;
    let hbUpYOff = 18;
    let hbDownXOff = 28;
    let hbDownYOff = 50;
    let hbLeftXOff = 18;
    let hbLeftYOff = 28;
    let hbRightXOff = 35;
    let hbRightYOff = 28;
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
    let animType = 1;
    Enemy.call(this, game, spritesheet, 240, animType, 24, 14, 18, 34);
    let hbHorWidth = 35;
    let hbHorHeight = 20;
    let hbVertWidth = 40;
    let hbVertHeight = 25;
    let hbUpXOff = 12;
    let hbUpYOff = 18;
    let hbDownXOff = 12;
    let hbDownYOff = 55;
    let hbLeftXOff = 10;
    let hbLeftYOff = 20;
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

function DesertWarriorDagger(game, spriteSheet) {
    let animType = 2;
    Enemy.call(this, game, spriteSheet, 240, animType, 24, 14, 18, 34);
    let hbHorWidth = 35;
    let hbHorHeight = 20;
    let hbVertWidth = 40;
    let hbVertHeight = 25;
    let hbUpXOff = 12;
    let hbUpYOff = 18;
    let hbDownXOff = 12;
    let hbDownYOff = 55;
    let hbLeftXOff = 10;
    let hbLeftYOff = 20;
    let hbRightXOff = 40;
    let hbRightYOff = 23;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

DesertWarriorDagger.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

DesertWarriorDagger.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

function DesertWarriorWarAxe(game, spriteSheet) {
    let animType = 1;
    Enemy.call(this, game, spriteSheet, 240, animType, 24, 14, 18, 34);
    let hbHorWidth = 35;
    let hbHorHeight = 20;
    let hbVertWidth = 40;
    let hbVertHeight = 25;
    let hbUpXOff = 12;
    let hbUpYOff = 18;
    let hbDownXOff = 12;
    let hbDownYOff = 55;
    let hbLeftXOff = 10;
    let hbLeftYOff = 20;
    let hbRightXOff = 40;
    let hbRightYOff = 23;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

DesertWarriorWarAxe.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

DesertWarriorWarAxe.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

function ZombieShovel(game, spriteSheet) {
    let animType = 2;
    Enemy.call(this, game, spriteSheet, 240, animType, 24, 14, 18, 34);
    let hbHorWidth = 35;
    let hbHorHeight = 20;
    let hbVertWidth = 40;
    let hbVertHeight = 25;
    let hbUpXOff = 12;
    let hbUpYOff = 18;
    let hbDownXOff = 12;
    let hbDownYOff = 55;
    let hbLeftXOff = 10;
    let hbLeftYOff = 20;
    let hbRightXOff = 40;
    let hbRightYOff = 23;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

ZombieShovel.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

ZombieShovel.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};
