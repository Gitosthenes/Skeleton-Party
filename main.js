let ASSET_MANAGER = new AssetManager();
var font = "VT323";

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
let def = 10;
let atk = 10;

//enemy stats
let enemyAtk = 1;

//time of countdown timer in seconds
let time = 60;

//enemy count
let enemyCount = 0;

//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheetSword, spritesheetBow) {
    let attkAnimSpeed = 0.05;

    this.x = -250;
    this.y = -50;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.baseSpeed = 280;
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
}

SkeletonDagger.prototype.hurtBoxInit = function () {
    let hbHorWidth = 80;
    let hbHorHeight = 38;
    let hbVertWidth = 115;
    let hbVertHeight = 38;
    let hbUpXOff = 5;
    let hbUpYOff = 0;
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


    if (this.isRecoiling && this.hitByEnemy) {
        hp = Math.max(0, hp-enemyAtk);
    }

    if(hp <= 0) {
        this.hitbox.isActive = false;
        this.speed = 0;
        this.isDead = true;
        this.currAnimation = this.animations['dying'];

        if (this.currAnimation.isDone()) {
            this.removeFromWorld = true;
        }
    }

    updatePlayerHitbox(this);
    checkForCollisions(this);
    updateRecoilFrames(this);

    this.changeX = this.changeY = false;

    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    if (!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }

};

function Arrow(game, spritesheet) {
    this.x = this.relX = 0;
    this.y = this.relY = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.removeFromWorld = false;
    this.speed = 500;
    this.isRecoiling = false;
    this.hitByEnemy = false;
    this.direction = this.game.player.direction;

    switch (this.game.player.direction) {
        case "down" :
            this.x = this.relX = 450;
            this.y = this.relY = 325 + 50;
            break;
        case "up" :
            this.x = this.relX = 450;
            this.y = this.relY = 325 - 15;
            break;
        case "left" :
            this.x = this.relX = 450 - 15;
            this.y = this.relY = 325;
            break;
        case "right":
            this.x = this.relX = 450 + 15;
            this.y = this.relY = 325;
            break
    }
    // console.log("arrow x " + this.x);
    // console.log("arrow y " + this.y);
    // console.log("player x " + playerX);
    // console.log("player y " + playerY);
    ArrowAnimationInit(this, this.spritesheet);
    this.hitbox = new Hitbox(this.x, this.y, 35, 32, true);
    this.currAnimation = this.animations[this.direction];
}

function ArrowAnimationInit(entity, spritesheet) {
    let animations = [];

    animations["left"] = new Animation(spritesheet, 0, 0, 50,
        40, 4, 1, 1, true, 1);
    animations["down"] = new Animation(spritesheet, 50, 0, 50, 40,
        4, 1, 1, true, 1);
    animations["up"] = new Animation(spritesheet, 100, 0, 50, 40,
        4, 1, 1, true, 1);
    animations["right"] = new Animation(spritesheet, 150, 0, 50, 40,
        4, 1, 1, true, 1);

    entity.animations = animations;
}

Arrow.prototype.update = function () {
    switch (this.direction) {
        case "down":
            this.y += this.game.clockTick * this.speed;
            break;

        case "up":
            this.y -= this.game.clockTick * this.speed;
            break;

        case "left":
            this.x -= this.game.clockTick * this.speed;
            break;

        case "right":
            this.x += this.game.clockTick * this.speed;
            break
    }
    updatePlayerHitbox(this);
    checkForCollisions(this);
    updateRecoilFrames(this);
    Entity.prototype.update.call(this);
};


Arrow.prototype.draw = function () {
    if (!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

//UI stuff below
function SkeletonHealthUI(game, spritesheet) {
    this.x = -10;
    this.y = -20;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    // console.log("drawing ui");
}

SkeletonHealthUI.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        // console.log("drawing ui 2")

        this.ctx.drawImage(this.spritesheet, this.x, this.y, 90, 90);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(hp.toString() + " HP", 52, 33);

    }
}

SkeletonHealthUI.prototype.update = function () {};

function SkeletonDefUI(game, spritesheet) {
    this.x = 19;
    this.y = 35;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

SkeletonDefUI.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 30, 30);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(def.toString() + " DEF", 52, 56);
    }
}

SkeletonDefUI.prototype.update = function () {};

function SkeletonAtkUI(game, spritesheet) {
    this.x = 19;
    this.y = 65;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

SkeletonAtkUI.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 25, 25);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(atk.toString() + " ATK", 52, 82);
    }
}

SkeletonAtkUI.prototype.update = function () {};

function EnemyUI (game, spritesheet) {
    this.x = 900;
    this.y = 4;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

EnemyUI.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 50, 50);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.game.enemyCount.toString() + " LEFT", 835, 33);
    }
}

EnemyUI.prototype.update = function () {};

function TimerUI (game, spritesheet) {
    this.x = 400;
    this.y = 10;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

TimerUI.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 35, 35);
        time -= this.game.clockTick;
        this.ctx.font = "48px " + font;
        this.ctx.fillStyle = 'white';
        if (time < 0) {
            time = 0;
            this.ctx.fillText("0:00", 450, 40);
        } else {
            var minutes = Math.floor(time/60);
            var seconds = time - minutes * 60;
            var timer = minutes.toString() + ":" + seconds.toFixed(0).padStart(2, '0')
            this.ctx.fillText(timer, 450, 40);
        }
    }
}

TimerUI.prototype.update = function () {
};
//! ******** Volume Toggle Definition ******** */
function VolumeToggle(game, spritesheet) {
    this.audio = document.getElementById('audio');
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
    this.state = 'on';
    this.game = game;
}

VolumeToggle.prototype.update = function () {};

/**
 * Draws the volume on/off icon depending on state.
 * @see https://webplatform.github.io/docs/concepts/programming/drawing_images_onto_canvas/
 *      for overloaded drawImage() parameters
 */
VolumeToggle.prototype.draw = function () {
    if (!this.game.onTitleScreen && !this.game.levelComplete) {
        if (this.state === 'on') {
            this.ctx.drawImage(this.spritesheet, 48, 0, 47 ,47, 900, 650, 30, 30);
        } else if (this.state === 'off') {
            this.ctx.drawImage(this.spritesheet, 0, 0, 47 ,47, 900, 650, 30, 30);
        }
    }
};

/**
 * Toggles volume state to ON if not playing; sets it to OFF and restarts audio track if it is playing.
 */
VolumeToggle.prototype.flipVolume = function () {
    if(!this.game.onTitleScreen && !this.game.levelComplete) {
        let isON = this.state == 'on' ? true : false;
        if (isON) {
            this.state = 'off';
            this.audio.pause();
            this.audio.currentTime = 0;
        } else {
            this.state = 'on'
            this.audio.play();
        }
    }
}

ASSET_MANAGER.retrieveAllAssets();
ASSET_MANAGER.downloadAll(function () {
    WebFontConfig = {
        google:{ families: [font] },
    };
    (function(){
        var wf = document.createElement("script");
        wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
        wf.async = 'true';
        document.head.appendChild(wf);
    })();

    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');

    let gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.startInput();

    gameEngine.setBackground(titleScreenInit(gameEngine, ASSET_MANAGER));
    // gameEngine.setBackground(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/titlescreen.jpg", 800, 800, 2.5)));
    // forestMapGenTerrain(gameEngine, ASSET_MANAGER);
    // forestMapGenEnemy(gameEngine, ASSET_MANAGER);
    gameEngine.setPlayer(new SkeletonDagger(gameEngine,
        ASSET_MANAGER.getAsset("./res/character/skeleton_sword.png"), ASSET_MANAGER.getAsset("./res/character/skeletonbow.png")));
    let volumeToggle = new VolumeToggle(gameEngine, ASSET_MANAGER.getAsset("./res/audio/volume_bgON.png"));
    gameEngine.setVolumeToggle(volumeToggle);
    gameEngine.addEntity(volumeToggle);
    let healthUI = new SkeletonHealthUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_life.png"))
    gameEngine.setHealthUI(healthUI);
    gameEngine.addEntity(healthUI);
    let defUI = new SkeletonDefUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/def_ui.png"));
    gameEngine.setDefUI(defUI);
    gameEngine.addEntity(defUI);
    let atkUI = new SkeletonAtkUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/sword_ui.png"));
    gameEngine.setAtkUI(atkUI);
    gameEngine.addEntity(atkUI);
    let enemyUI = new EnemyUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/enemy_ui.png"));
    gameEngine.setEnemyUI(enemyUI);
    gameEngine.addEntity(enemyUI);
    let timerUI = new TimerUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/timer_ui.png"));
    gameEngine.setTimerUI(timerUI);
    gameEngine.addEntity(timerUI);
    gameEngine.start();
});
