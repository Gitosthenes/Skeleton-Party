let ASSET_MANAGER = new AssetManager();
let ON_TITLESCREEN = true;

//For scrolling
//storing both the canvas's coordinates and the player coordinates
let bgX = 0;
let bgY = 0;
let playerX = 0;
let playerY = 0;
let playerXSpeed = 0;
let playerYSpeed = 0;

function IsOnTitleScreen() { return ON_TITLESCREEN; }

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
function Background(game, spritesheet) {
    this.x = bgX;
    this.y = bgY;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.radius = 200;
};

Background.prototype.draw = function () {
    if(ON_TITLESCREEN) this.ctx.drawImage(this.spritesheet, this.x, this.y);
    else this.ctx.drawImage(this.spritesheet, this.x, this.y, 800 * 2.5, 800 * 2.5);
};

Background.prototype.update = function () {
    if (this.game.userInput.includes(' ')) {
        if(IsOnTitleScreen()) {
            this.spritesheet = ASSET_MANAGER.getAsset("./res/map/Floor1.png");
            document.getElementById('audio').play();
            document.getElementById('audio').volume = 0.5;
            ON_TITLESCREEN = false;
        }
    }

    //this is the scrolling
    if(!ON_TITLESCREEN) {
        this.x = bgX - playerX;
        this.y = bgY - playerY;
        // bgX = this.x;
        // bgY = this.y;
        // Entity.prototype.update.call(this);
        console.log("Background X = " + this.x + " Background Y = " + this.y);
        console.log("Player X " + playerX + " player Y " + playerY);
    }
    

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
    if (!IsOnTitleScreen()) {
        if (this.state === 'on') {
            this.ctx.drawImage(this.spritesheet, 48, 0, 47 ,47, 5, 5, 30, 30);
        } else if (this.state === 'off') {
            this.ctx.drawImage(this.spritesheet, 0, 0, 47 ,47, 5, 5, 30, 30);
        }
    }
};

/**
 * Toggles volume state to ON if not playing; sets it to OFF and restarts audio track if it is playing.
 */
VolumeToggle.prototype.flipVolume = function () {
    if(!IsOnTitleScreen()) {
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

//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheet) {
    entityAnimationInit(this, spritesheet);
    this.x = -250;
    this.y = -50;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.baseSpeed = 200;
    this.changeX = false;
    this.changeY = false;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.isBusy = false;
    this.titleScreenComp = true;
    this.currAnimation = this.animations['idleDown'];
    this.hitbox = new Hitbox(this.x, this.y, 50, 32);
    this.invincibilityFrames = 0;
}

function entityAnimationInit(entity, spritesheet) {
  let animations = [];

  /* Idle animations. */
  animations['idleUp'] = new Animation(spritesheet, 0, 0, 64, 62, 512, 0.6, 2, true, 1);
  animations['idleDown'] = new Animation(spritesheet, 0, 128, 64, 62, 512, 0.5, 2, true, 1);
  animations['idleLeft'] = new Animation(spritesheet, 0, 64, 64, 62, 512, 0.6, 2, true, 1);
  animations['idleRight'] = new Animation(spritesheet, 0, 192, 64, 62, 512, 0.6, 2, true, 1);

  /* Walking animations. */
  animations['walkUp'] = new Animation(spritesheet, 0, 512, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkDown'] = new Animation(spritesheet, 0, 640, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkLeft'] = new Animation(spritesheet, 0, 576, 64, 62, 9, 0.15, 9, true, 1);
  animations['walkRight'] = new Animation(spritesheet, 0, 704, 64, 62, 9, 0.15, 9, true, 1);

  /* Attack animations. */
  animations['attackUp'] = new Animation(spritesheet, 0, 768, 64, 62, 6, 0.05, 6, true, 1);
  animations['attackDown'] = new Animation(spritesheet, 0, 896, 64, 62, 6, 0.05, 6, true, 1);
  animations['attackLeft'] = new Animation(spritesheet, 0, 832, 64, 62, 6, 0.05, 6, true, 1);
  animations['attackRight'] = new Animation(spritesheet, 0, 960, 64, 62, 6, 0.05, 6, true, 1);

  entity.animations = animations;
}

SkeletonDagger.prototype.update = function () {
    handleInput(this);

    if (this.changeX) {
        playerX += this.game.clockTick * this.xSpeed;
    }
    if (this.changeY) {
        playerY += this.game.clockTick * this.ySpeed;
    }

    updatePlayerHitbox(this);
    drawDebugHitbox(this);
    checkForCollisions(this);
    updateInvincibilityFrames(this);

    if (this.x > 1024) {
        this.x = -64
    } else if (this.x < -64) {
        this.x = 1024;
    } else if (this.y > 1088) {
        this.y = 0;
    } else if (this.y < 0) {
        this.y = 1088;
    }

    this.changeX = this.changeY = false;
    
    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

function MaleKnightSpear(game,spritesheet) {
    this.x = -200;
    this.y = 80;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.state = "walkDown";
    this.titleScreenComp = true;
    this.currAnimation = new Animation(spritesheet, 0, 384, 64, 62, 512, 0.1, 8, true, 1);
    this.hitbox = new Hitbox(this.x, this.y, 62, 64);
}

MaleKnightSpear.prototype.update = function() {
    let key = this.game.userInput[0];
    switch (key) {
        case ' ':
            this.x = 650;
            break;
    }
    updateHitbox(this);
    Entity.prototype.update.call(this);
}

MaleKnightSpear.prototype.draw = function() {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function MaleKnightMace(game,spritesheet) {
    this.x = -200;
    this.y = 80;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.state = "walkDown";
    this.titleScreenComp = true;
    this.currAnimation = new Animation(spritesheet, 0, 1744, 190, 123, 6, 0.1, 6, true, 1);
    this.hitbox = new Hitbox(this.x, this.y, 62, 44);
}

MaleKnightMace.prototype.update = function() {
    let key = this.game.userInput[0];
    switch (key) {
        case ' ':
            this.x = 690;
            break;
    }
    Entity.prototype.update.call(this);
}

MaleKnightMace.prototype.draw = function() {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


//! ******** QUEUE ASSET DOWNLOAD ******** */
// Background images
ASSET_MANAGER.queueDownload("./res/map/titlescreen.jpg");
ASSET_MANAGER.queueDownload("./res/map/proto_map.jpg");
ASSET_MANAGER.queueDownload("./res/map/Floor1.png")
// Character sprites
ASSET_MANAGER.queueDownload("./res/character/skeleton_dagger.png");
ASSET_MANAGER.queueDownload("./res/character/male_knight_spear.png");
ASSET_MANAGER.queueDownload("./res/character/male_knight_mace.png");
// Audio assets
ASSET_MANAGER.queueDownload("./res/audio/megalovania.mp3");
ASSET_MANAGER.queueDownload("./res/audio/volume_bgON.png");
ASSET_MANAGER.queueDownload("./res/audio/volume_bgOFF.png");


ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');

    let gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.startInput();

    gameEngine.setBackground(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/titlescreen.jpg")));
    gameEngine.addEnemy(new MaleKnightSpear(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_spear.png")));
    gameEngine.addEnemy(new MaleKnightMace(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_mace.png")));
    gameEngine.setPlayer(new SkeletonDagger(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_dagger.png")));
    let volumeToggle = new VolumeToggle(gameEngine, ASSET_MANAGER.getAsset("./res/audio/volume_bgON.png"));
    gameEngine.setVolumeToggle(volumeToggle);
    gameEngine.addEntity(volumeToggle);

    gameEngine.start();
});
