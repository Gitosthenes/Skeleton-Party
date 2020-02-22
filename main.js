let ASSET_MANAGER = new AssetManager();
let ON_TITLESCREEN = true;
let GAME_OVER = false;
var font = "VT323";

//For scrolling
//storing both the canvas's coordinates and the player coordinates
let bgX = 0;
let bgY = 0;
let playerX = 0;
let playerY = 0;
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

function changePlayerX(val) {
    playerX += val;
}

function changePlayerY(val) {
    playerY += val;
}



//! ******** Animation Definition ******** */
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }

    let frame = this.currentFrame();
    let xindex = frame % this.sheetWidth;
    let yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth + this.startX,
        yindex * this.frameHeight + this.startY,
        this.frameWidth,
        this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);

    if (this.hitbox !== undefined) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    }
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//! ******** Background Definition ******** */
function Background(game, spritesheet, width, height, scale) {
    this.x = bgX;
    this.y = bgY;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype.draw = function () {
    if(ON_TITLESCREEN) this.ctx.drawImage(this.spritesheet, this.x, this.y);
    else {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 800 * 2.5, 800 * 2.5); // Why? Who knows!
    }
    if(time <= 0 || hp <= 0) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("<GAME OVER>", 425, 350);
        this.ctx.fillText("Refresh to start again!", 370, 450);
        GAME_OVER = true;
    }
    if(enemyCount === 0) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("<YOU WIN>", 425, 350);
        this.ctx.fillText("Refresh to start again!", 370, 450);
        GAME_OVER = true;
    }
};

Background.prototype.update = function () {
    if (this.game.userInput.includes(' ')) {
        if(ON_TITLESCREEN) {
            this.spritesheet = ASSET_MANAGER.getAsset("./res/map/forest.png");
            document.getElementById('audio').play();
            document.getElementById('audio').volume = 0.5;
            ON_TITLESCREEN = false;
        }
    }

    //this is the scrolling
    //background coordinates for debug
    // console.log("x = " + this.x);
    // console.log("y = " + this.y);
    if(!ON_TITLESCREEN) {
        // Bounds checking for the x axis.
        if (bgX - playerX > 438) {
            this.x = 438;
            boundHitLeft = true;
        } else if (bgX - playerX < -1476) {
            this.x = -1476;
            boundHitRight = true;
        } else {
            boundHitLeft = false;
            boundHitRight = false;
            this.x = bgX - playerX;
        }
        // Bounds checking for the y axis.
        if (bgY - playerY > 303) {
            this.y = 303;
            boundHitUp = true;
        } else if (bgY - playerY < -1550) {
            this.y = -1550;
            boundHitDown = true;
        } else {
            boundHitUp = false;
            boundHitDown = false;
            this.y = bgY - playerY;
        }
    }
};


//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheet) {
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
    this.isAttacking = false;
    this.isRecoiling = false;
    this.attAnimationSpeed = 0.05;
    entityAnimationInit(this, spritesheet, 1);
    this.currAnimation = this.animations['idleDown'];
    this.hitbox = new Hitbox(this.x, this.y, 50, 32, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, true);
    this.invincibilityFrames = 0;
}

function entityAnimationInit(entity, spritesheet, type) {
  let animations = [];

  /* Walking animations. */
  animations['walkUp'] = new Animation(spritesheet, 0, 512, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkDown'] = new Animation(spritesheet, 0, 640, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkLeft'] = new Animation(spritesheet, 0, 576, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkRight'] = new Animation(spritesheet, 0, 704, 64, 62, 9, 0.15, 9, true, 1);

  switch(type) {
      case 1: //For large attack spritesheets with idle
        /* Idle animations. */
        animations['idleUp'] = new Animation(spritesheet, 0, 0, 64, 62, 512, 0.6, 2, true, 1);
        animations['idleDown'] = new Animation(spritesheet, 0, 128, 64, 62, 512, 0.5, 2, true, 1);
        animations['idleLeft'] = new Animation(spritesheet, 0, 64, 64, 62, 512, 0.6, 2, true, 1);
        animations['idleRight'] = new Animation(spritesheet, 0, 192, 64, 62, 512, 0.6, 2, true, 1);

        /* Attack animations. */
        animations['attackUp'] = new Animation(spritesheet, 62, 1411, 189, 121, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackDown'] = new Animation(spritesheet, 64, 1790, 189, 121, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackLeft'] = new Animation(spritesheet, 66, 1603, 189, 121, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackRight'] = new Animation(spritesheet, 66, 1985, 189, 121, 6, entity.attAnimationSpeed, 6, true, 1);
        break;

    case 2: //For small attack spritesheets w/o idle
        /* Attack animations. */
        animations['attackUp'] = new Animation(spritesheet, 0, 258, 64, 62, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackDown'] = new Animation(spritesheet, 0, 387, 64, 62, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackLeft'] = new Animation(spritesheet, 0, 322, 64, 62, 6, entity.attAnimationSpeed, 6, true, 1);
        animations['attackRight'] = new Animation(spritesheet, 0, 450, 64, 62, 6, entity.attAnimationSpeed, 6, true, 1);
        break;
  }


  entity.animations = animations;
}

SkeletonDagger.prototype.takeDamage = function(amount) {
    hp -= amount;
}

SkeletonDagger.prototype.update = function () {
    // let that = this;
    handleInput(this);

    //If attacking, activate hurtbox; Otherwise disable it
    if(this.isAttacking && this.currAnimation.elapsedTime == 0) {
        activateHurtbox(this);
    }
    if(!this.isAttacking) this.hurtbox.isActive = false;

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

    if (this.isRecoiling) {
        hp -= enemyAtk;
    }

    updatePlayerHitbox(this);
    checkForCollisions(this);
    updateInvincibilityFrames(this);

    this.changeX = this.changeY = false;

    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    if (!ON_TITLESCREEN && !GAME_OVER) {
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
      
        if (this.isRecoiling) {
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
      
        if (this.isRecoiling) {
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
    if(!ON_TITLESCREEN && !GAME_OVER) {
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
    if(!ON_TITLESCREEN && !GAME_OVER) {
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
    if(!ON_TITLESCREEN && !GAME_OVER) {
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
    if(!ON_TITLESCREEN && !GAME_OVER) {
        enemyCount = this.game.enemies.length;
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 50, 50);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(enemyCount.toString() + " LEFT", 835, 33);
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
    if(!ON_TITLESCREEN && !GAME_OVER) {
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
}

VolumeToggle.prototype.update = function () {};

/**
 * Draws the volume on/off icon depending on state.
 * @see https://webplatform.github.io/docs/concepts/programming/drawing_images_onto_canvas/
 *      for overloaded drawImage() parameters
 */
VolumeToggle.prototype.draw = function () {
    if (!ON_TITLESCREEN) {
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
    if(!ON_TITLESCREEN) {
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



//! ******** QUEUE ASSET DOWNLOAD ******** */
// Background images
ASSET_MANAGER.queueDownload("./res/map/titlescreen.jpg");
ASSET_MANAGER.queueDownload("./res/map/proto_map.jpg");
ASSET_MANAGER.queueDownload("./res/map/Floor1.png");
ASSET_MANAGER.queueDownload("./res/map/forest.png");
// Character sprites
ASSET_MANAGER.queueDownload("./res/character/skeleton_sword.png");
ASSET_MANAGER.queueDownload("./res/character/male_knight_spear.png");
ASSET_MANAGER.queueDownload("./res/character/male_knight_mace.png");
ASSET_MANAGER.queueDownload("./res/character/skeleton_life.png");
ASSET_MANAGER.queueDownload("./res/character/def_ui.png");
ASSET_MANAGER.queueDownload("./res/character/sword_ui.png");
ASSET_MANAGER.queueDownload("./res/character/enemy_ui.png");
ASSET_MANAGER.queueDownload("./res/character/timer_ui.png");
// Audio assets
ASSET_MANAGER.queueDownload("./res/audio/megalovania.mp3");
ASSET_MANAGER.queueDownload("./res/audio/volume_bgON.png");
ASSET_MANAGER.queueDownload("./res/audio/volume_bgOFF.png");
// Terrain assets.
ASSET_MANAGER.queueDownload("./res/terrain/Rock1.png");
ASSET_MANAGER.queueDownload("./res/terrain/Rock2.png");
ASSET_MANAGER.queueDownload("./res/terrain/DirtHole.png");
ASSET_MANAGER.queueDownload("./res/terrain/IvyColumn.png");


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

    gameEngine.setBackground(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/titlescreen.jpg", 800, 800, 2.5)));
    forestMapGenTerrain(gameEngine, ASSET_MANAGER);
    forestMapGenEnemy(gameEngine, ASSET_MANAGER);
    // gameEngine.addEnemy(new MaleKnightSpear(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_spear.png")));
    // gameEngine.addEnemy(new MaleKnightMace(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_mace.png")));
    gameEngine.setPlayer(new SkeletonDagger(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_sword.png")));
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

    enemyCount = gameEngine.enemies.length;

    gameEngine.start();
});
