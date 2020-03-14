let ANIMATION_DELAY_FACTOR = 1.9;

function Enemy(game, spriteSheet, fxSpritesheet, primaryAnimType, attkType, speed, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight, attkAnimTime, attkRange) {
    let coords = [100, 1000, 1950];
    this.isActive = false;
    this.removeFromWorld = false;
    this.game = game;
    this.hitboxOffsetX = hitboxOffsetX;
    this.hitboxOffsetY = hitboxOffsetY;
    this.baseSpeed = speed;
    this.attkType = attkType;
    this.attkAnimTime = attkAnimTime;
    this.attkRange = attkRange;
    this.currRange = 2000;
    // this.x = this.relativeX = 100;
    // this.y = this.relativeY = 100;
    this.x = this.relativeX = coords[Math.floor(Math.random() * 3)];
    this.y = this.relativeY = coords[Math.floor(Math.random() * 3)];
    this.absX = this.relativeX - (450 + playerX);
    this.absY = this.relativeY - (325 + playerY);
    this.spawnX = this.x;
    this.spawnY = this.y;
    this.ctx = game.ctx;
    this.enemyHP = 100;
    this.isAttacking = false;
    this.isRecoiling = false;
    this.xSpeed = 0;
    this.ySpeed = 0;

    this.direction = 'Down';
    this.state = "walkDown";

    this.animations = entityAnimationInit(attkAnimTime, spriteSheet, spriteSheet, primaryAnimType);
    this.altAnimations = altAnimationInit(attkAnimTime, fxSpritesheet, attkType);
    this.fxOffsets = setupFXoffsets(attkType);
    this.currAnimation = this.animations[this.state];
    this.currAltAnimation = this.altAnimations[attkType + this.direction];
    this.hitbox = new Hitbox(this.x, this.y, hitboxHeight, hitboxWidth, false);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);
}

Enemy.prototype.update = function() {
    if(!this.game.onTitleScreen) {
        let animationDelay = this.currAnimation.totalTime / ANIMATION_DELAY_FACTOR;

        updateEnemyPositionAndAnimation(this);
        updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
        updateRecoilFrames(this);

        if(this.isAttacking && this.currAnimation.elapsedTime > animationDelay) activateHurtbox(this);
        if(!this.isAttacking) this.hurtbox.isActive = false;
        checkForCollisions(this);

        if (this.isRecoiling && this.hitByEnemy) {
            let enemyHurtAudio = document.getElementById("enemyHurtAudio");
            enemyHurtAudio.play();
            this.enemyHP -= atk * 4;
            if(this.enemyHP <= 0) {
                chanceForPowerUp(this);
                console.log("died at x: " + this.x + "y: " + this.y);
                this.game.enemyCount--;
                this.game.currentSpawnCount --;
                this.removeFromWorld = true;
            }
        }
    }
    Entity.prototype.update.call(this);
};

Enemy.prototype.draw = function() {
    if(!this.game.onTitleScreen && !this.game.gameOver && this.isActive) {

        if(this.direction === 'Up') {
            if(this.currAltAnimation && this.fxOffsets[this.direction] && this.hurtbox.isActive) {
                let offsets = this.fxOffsets[this.direction];
                this.currAltAnimation.drawFrame(this.game.clockTick, this.ctx, (this.x + offsets.x), (this.y + offsets.y));
            }

            this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        } else {
            this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

            if(this.currAltAnimation && this.fxOffsets[this.direction] && this.hurtbox.isActive) {
                let offsets = this.fxOffsets[this.direction];
                this.currAltAnimation.drawFrame(this.game.clockTick, this.ctx, (this.x + offsets.x), (this.y + offsets.y));
            }
        }

        Entity.prototype.draw.call(this);
    }
};

//!----------Enemy update logic----------
function distance(a, b) {
    if(a.x && a.y && b.x && b.y) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
    }
}

function updateEnemyPositionAndAnimation(enemy) {
    //Update relative distance between enemy and player for scrolling consistency
    let deltaX, deltaY;
    let oldX = enemy.x;
    let oldY = enemy.y;

    enemy.x = enemy.relativeX - playerX;
    enemy.y = enemy.relativeY - playerY;
    deltaX = oldX - enemy.x;
    deltaY = oldY - enemy.y;
    enemy.relativeX += (deltaX - playerDeltaX) / 2;
    enemy.relativeY += (deltaY - playerDeltaY) / 2;

// Update distance again to reflect entity's movement
    let dx = playerX - enemy.absX;
    let dy = playerY - enemy.absY;
    if (!enemy.isRecoiling) {
        if (distance(enemy, enemy.game.player) > enemy.currRange ) {
            if(dx < 0) {
                enemy.x -= (enemy.game.clockTick * enemy.baseSpeed);
                enemy.absX -= Math.abs((deltaX - playerDeltaX) / 2);
            } else if(dx > 2) {
                enemy.x += (enemy.game.clockTick * enemy.baseSpeed);
                enemy.absX += Math.abs((deltaX - playerDeltaX) / 2);
            }
            if(dy < 0) {
                enemy.y -= enemy.game.clockTick * enemy.baseSpeed;
                enemy.absY -= Math.abs((deltaY - playerDeltaY) / 2);
            } else if(dy > 2) {
                enemy.y += enemy.game.clockTick * enemy.baseSpeed;
                enemy.absY += Math.abs((deltaY - playerDeltaY) / 2);
            }
        }
    }
    else {
        let xSign = enemy.xSpeed ? (enemy.xSpeed / Math.abs(enemy.xSpeed)) : 0; // -1 if xSpeed is negative, +1 is positive, 0 if falsey
        let ySign = enemy.ySpeed ? (enemy.ySpeed / Math.abs(enemy.ySpeed)) : 0; // -1 if ySpeed is negative, +1 is positive, 0 if falsey
        enemy.x += enemy.game.clockTick * enemy.xSpeed;
        enemy.y += enemy.game.clockTick * enemy.ySpeed;
        enemy.absX += Math.abs((deltaX - playerDeltaX) / 2) * xSign;
        enemy.absY += Math.abs((deltaY - playerDeltaY) / 2) * ySign;
    }

    updateEnemyAnimation(enemy);
}


function updateEnemyAnimation(enemy) {
    let action, direction;

    if(!enemy.isAttacking) {
        // if(enemy.currAltAnimation) enemy.currAltAnimation.elapsedTime = 0;
        direction = getDirToFacePlayer(enemy);
        enemy.currAltAnimation = enemy.altAnimations[enemy.attkType + direction];
        if(distance(enemy.game.player, enemy) > enemy.currRange) {//should the enemy be walking towards the player?
            action = 'walk';
            enemy.isAttacking = false;
        } else { //else enemy should be attaking the player
            action = 'attack';
            enemy.isAttacking = true;
        }
    } else if(enemy.currAnimation.elapsedTime === 0) {
        if(enemy.currAltAnimation) enemy.currAltAnimation.elapsedTime = 0;
        enemy.isAttacking = false;
    }

    if(action && direction) {
        enemy.direction = direction;
        enemy.state = action+direction;
        enemy.currAnimation = enemy.animations[action+direction];
    }
}

function getDirToFacePlayer(enemy) {
    let UpDown_threshold = 1.1;
    let leftRight_threshold = 0.8;
    let direction = enemy.direction;
    let dy = playerY - enemy.absY;
    let dx = playerX - enemy.absX;
    let m = dy / dx;

    if(m > -leftRight_threshold && m < leftRight_threshold) {
        direction = dx > 0 ? 'Right' : 'Left';
    } else if(m < -UpDown_threshold || m > UpDown_threshold) {
        direction = dy > 0 ? 'Down' : 'Up';
    }

    return direction;
}

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

//!----------Enemy function definitions----------
function PlaceHolderEnemy(game, spritesheet) {
    Enemy.call(this, game, spritesheet, 200, 1, 0, 0, 0, 0);
    this.hurtbox = new Hurtbox(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

PlaceHolderEnemy.prototype.update = function () {};
PlaceHolderEnemy.prototype.draw = function () {};

function MaleKnightSpear(game, spritesheet, fxSpritesheet) {
    let primaryAnimType = 2;
    let secondaryAnimType = 'thrust';
    let attkAnimTime = 0.1;
    let attkRange = 100;
    Enemy.call(this, game, spritesheet, fxSpritesheet, primaryAnimType, secondaryAnimType, 200, 24, 14, 18, 34, attkAnimTime, attkRange);

    //For left/right hurtboxes
    let hbHorWidth = 90;
    let hbHorHeight = 35;
    let hbLeftXOff = 60;
    let hbLeftYOff = 20;
    let hbRightXOff = 40;
    let hbRightYOff = 20;
    //For up/down hurtboxes
    let hbVertWidth = 30;
    let hbVertHeight = 80;
    let hbUpXOff = 20;
    let hbUpYOff = 60;
    let hbDownXOff = 15;
    let hbDownYOff = 50;

    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
                                hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

MaleKnightSpear.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

MaleKnightSpear.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

function MaleKnightMace(game, spritesheet, fxSpritesheet) {
    let primaryAnimType = 1; //Large attk sprite
    let secondaryAnimType = 'slash'; // slash animation
    let attkAnimTime = 0.07;
    let attkRange = 80;
    Enemy.call(this, game, spritesheet, fxSpritesheet, primaryAnimType, secondaryAnimType, 240, 24, 14, 18, 34, attkAnimTime, attkRange);

    //For left/right hurtboxes
    let hbHorWidth = 75;
    let hbHorHeight = 60;
    let hbLeftXOff = 50;
    let hbLeftYOff = 5;
    let hbRightXOff = 40;
    let hbRightYOff = 5;
    //For up/down hurtboxes
    let hbVertWidth = 150;
    let hbVertHeight = 50;
    let hbUpXOff = -30;
    let hbUpYOff = 35;
    let hbDownXOff = -30;
    let hbDownYOff = 50;

    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

MaleKnightMace.prototype.update = function() {
    Enemy.prototype.update.call(this);
};

MaleKnightMace.prototype.draw = function() {
    Enemy.prototype.draw.call(this);
};

function DesertWarriorDagger(game, spritesheet, fxSpritesheet) {
    let primaryAnimType = 3;
    let secondaryAnimType = ''; //N/A
    let attkAnimTime = 0.1;
    let attkRange = 50;
    Enemy.call(this, game, spritesheet, fxSpritesheet, primaryAnimType, secondaryAnimType, 240, 24, 14, 18, 34, attkAnimTime, attkRange);
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

function DesertWarriorWarAxe(game, spriteSheet, fxSpritesheet) {
    let primaryAnimType = 1;
    let secondaryAnimType = ''; //N/A
    let attkAnimTime = 0.1;
    let attkRange = 80;
    Enemy.call(this, game, spriteSheet, fxSpritesheet, primaryAnimType, secondaryAnimType, 240, 24, 14, 18, 34, attkAnimTime, attkRange);
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

function ZombieShovel(game, spriteSheet, fxSpritesheet) {
    let primaryAnimType = 3;
    let secondaryAnimType = ''; //N/A
    let attkAnimTime = 0.1;
    let attkRange = 80;
    Enemy.call(this, game, spriteSheet, fxSpritesheet, primaryAnimType, secondaryAnimType, 240, 24, 14, 18, 34, attkAnimTime, attkRange);
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

