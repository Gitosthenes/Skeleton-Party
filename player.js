//For scrolling
//storing both the canvas's coordinates and the player coordinates
let bgX = 0;
let bgY = 0;
let playerX = 0;
let playerY = 0;
let playerDeltaX = 0;
let playerDeltaY = 0;
let boundHitLeft = false;
let boundHitRight = false;
let boundHitUp = false;
let boundHitDown = false;

//Character Stats
let hp = 100;
let def = 1;
let atk = 1;

//enemy stats
let enemyAtk = 8;

//time of countdown timer in seconds
let time = 40;


//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheetSword, spritesheetBow) {
    let attkAnimSpeed = 0.05;

    this.x = -250;
    this.y = -50;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.baseSpeed = 300;
    this.changeX = false;
    this.changeY = false;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.isAttackingSword = false;
    this.isAttackingBow = false;
    this.isRecoiling = false;
    this.hitByEnemy = false;
    this.hitByTerrain = false;
    this.animations = entityAnimationInit(attkAnimSpeed, spritesheetSword, spritesheetBow,1);
    this.currAnimation = this.animations['idleDown'];
    this.hitbox = new Hitbox(this.x, this.y, 35, 32, true);
    this.hurtBoxInit();
    this.recoilFrames = 0;
    this.speedUpFrames = 0;
}

SkeletonDagger.prototype.hurtBoxInit = function () {
    let hbHorWidth = 74;
    let hbHorHeight = 38;
    let hbVertWidth = 115;
    let hbVertHeight = 45;
    let hbUpXOff = 5;
    let hbUpYOff = 6;
    let hbDownXOff = 5;
    let hbDownYOff = 45;
    let hbLeftXOff = 52;
    let hbLeftYOff = 17;
    let hbRightXOff = 40;
    let hbRightYOff = 17;
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

SkeletonDagger.prototype.takeDamage = function(amount) {
    hp -= amount;
};

SkeletonDagger.prototype.update = function () {
    handleInput(this);
    //If attacking, activate hurtbox; Otherwise disable it
    if(this.isAttackingSword && this.currAnimation.elapsedTime === 0) activateHurtbox(this);
    if(this.isAttackingBow && this.currAnimation.elapsedTime === 0) {
        this.game.addProjectile(new Arrow(this.game, ASSET_MANAGER.getAsset("./res/character/Arrow.png")));
    }
    if(!this.isAttackingSword) this.hurtbox.isActive = false;

    let oldX = playerX;
    let oldY = playerY;
    if (this.changeX) {
        playerX += this.game.clockTick * this.xSpeed;
        if(boundHitLeft) playerX = -438;
        if(boundHitRight) playerX = 1476;
    }
    if (this.changeY) {
        playerY += this.game.clockTick * this.ySpeed;
        if(boundHitUp) playerY = -303;
        if(boundHitDown) playerY = 1550;
    }
    playerDeltaX = playerX - oldX;
    playerDeltaY = playerY - oldY;

    if (this.isRecoiling && this.hitByEnemy && this.recoilFrames === 0) {
        hp = Math.max(0, hp-enemyAtk);
    }

    if (hp <= 0) {
        this.hitbox.isActive = false;
        this.baseSpeed = 0;
        this.currAnimation = this.animations['dying'];

        if (this.currAnimation.isDone()) {
            this.isDead = true;
            this.removeFromWorld = true;
        }
    }

    updatePlayerHitbox(this);
    checkForCollisions(this);
    updateRecoilFrames(this);

    if (this.speedUpFrames > 0) {
        this.speedUpFrames--;
        if (this.speedUpFrames === 0) this.baseSpeed = 300;
    }

    this.changeX = this.changeY = false;

    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    if (!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

function setGodMode() {
    atk += 100;
    time += 999;
    hp = 10000;
}

