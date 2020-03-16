//For scrolling
//storing both the canvas's coordinates and the player coordinates
let bgX = playerX = playerDeltaX = 0;
let bgY = playerY = playerDeltaY = 0;
let boundHitLeft = false;
let boundHitRight = false;
let boundHitUp = false;
let boundHitDown = false;

//Character Stats
let hp = 100;
let def = 1;
let atk = 1;
let attkAnimDelayFactor = 2;

//enemy stats
let enemyAtk = 5;

//time of countdown timer in seconds
let time = 40;


//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheetSword, spritesheetBow, spritesheetFX) {
    let attkAnimSpeed = 0.065;

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
    this.altAnimations = altAnimationInit(attkAnimSpeed, spritesheetFX, 'slice');
    this.fxOffsets = setupFXoffsets('slice');
    this.currAnimation = this.animations['idleDown'];
    this.hitbox = new Hitbox(this.x, this.y, 35, 32, true);
    this.hurtBoxInit();
    this.recoilFrames = 0;
    this.speedUpFrames = 0;
}

SkeletonDagger.prototype.hurtBoxInit = function () {
    //Sizes and offsets for Left/Right attacks 
    let hbHorWidth = 100;
    let hbHorHeight = 55;
    let hbLeftXOff = 58;
    let hbLeftYOff = 0;
    let hbRightXOff = 28;
    let hbRightYOff = 0
    //Sizes and offsets for Up/Down attacks
    let hbVertWidth = 110
    let hbVertHeight = 70;
    let hbUpXOff = 0;
    let hbUpYOff = 52;
    let hbDownXOff = 0;
    let hbDownYOff = 45;
    
    this.hurtbox = new Hurtbox(hbHorWidth, hbHorHeight, hbVertWidth, hbVertHeight, hbUpXOff, hbUpYOff,
        hbDownXOff, hbDownYOff, hbLeftXOff, hbLeftYOff, hbRightXOff, hbRightYOff);
}

SkeletonDagger.prototype.takeDamage = function(amount) {
    hp -= amount;
};

SkeletonDagger.prototype.update = function () {
    handleInput(this);
    let animationDelay = this.currAnimation.totalTime / attkAnimDelayFactor;

    //If attacking, activate hurtbox; Otherwise disable it
    if(this.isAttackingSword && this.currAnimation.elapsedTime > animationDelay) {
        activateHurtbox(this);
        let swordSound = document.getElementById("swordAudio");
        swordSound.play();
    } else if(!this.isAttackingSword) {
        this.hurtbox.isActive = false;
        if(this.cooldown) this.cooldown--;
    }

    //if attacking with bow, generate arrow
    if(this.isAttackingBow && this.currAnimation.elapsedTime === 0) {
        this.game.addProjectile(new Arrow(this.game, ASSET_MANAGER.getAsset("./res/character/Arrow.png")));
        let bowSound = document.getElementById("bowAudio");
        bowSound.play();
    }
    
    //Player movement calculations
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

    //Damage calculations
    if (this.isRecoiling && this.hitByEnemy && this.recoilFrames === 0) {
        let playerHurtAudio = document.getElementById("playerHurtAudio");
        playerHurtAudio.play();
        hp = Math.max(0, hp-enemyAtk);
    }

    //If dead, go through death sequence
    if (hp <= 0) {
        this.hitbox.isActive = false;
        this.baseSpeed = 0;
        this.currAnimation = this.animations['dying'];
        if (hp === 0) {
            let playerDyingAudio = document.getElementById("playerDyingAudio");
            playerDyingAudio.play();
        }
        if (this.currAnimation.isDone()) {
            playerDyingAudio.pause();
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
        //Render attack FX first
        if(this.currAltAnimation && this.fxOffsets[this.direction] && this.hurtbox.isActive) {
            let offsets = this.fxOffsets[this.direction];
            this.currAltAnimation.drawFrame(this.game.clockTick, this.ctx, (this.x + offsets.x), (this.y + offsets.y));
        }
        //Render character
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        
        Entity.prototype.draw.call(this);
    }
};

function setGodMode() {
    atk += 100;
    time += 999;
    hp = 10000;
}