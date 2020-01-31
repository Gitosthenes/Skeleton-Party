var ASSET_MANAGER = new AssetManager();

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
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//! ******** Background Definition ******** */
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.titleScreenComp = true;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
    if (this.game.userInput.includes(' ')) {
        if(this.titleScreenComp) {
            this.spritesheet = ASSET_MANAGER.getAsset("./res/map/proto_map.jpg");
            document.getElementById('audio').play();
            document.getElementById('audio').volume = 0.5;
            this.titleScreenComp = false;
        }
    }
};


//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheet) {
    this.x = 50;
    this.y = 50;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = "walkDown";
    this.titleScreenComp = true;
    this.animations = SkeletonAnimationInit(spritesheet);
    this.currAnimation = this.animations['idleDown'];
}

function SkeletonAnimationInit(spritesheet) {
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

  /* Dagger attack animations. */
  animations['daggerUp'] = new Animation(spritesheet, 0, 768, 64, 62, 6, 0.075, 6, true, 1);
  animations['daggerDown'] = new Animation(spritesheet, 0, 896, 64, 62, 6, 0.075, 6, true, 1);
  animations['daggerLeft'] = new Animation(spritesheet, 0, 832, 64, 62, 6, 0.075, 6, true, 1);
  animations['daggerRight'] = new Animation(spritesheet, 0, 960, 64, 62, 6, 0.075, 6, true, 1);

  return animations;
}

SkeletonDagger.prototype.update = function () {
    let changeX = false;
    let changeY = false;
    for (let i = 0; i < this.game.userInput.length; i++) {
        let key = this.game.userInput[i];
        switch (key) {
            case 'idle':
                if (this.state === 'walkUp') this.currAnimation = this.animations['idleUp'];
                else if (this.state === 'walkDown') this.currAnimation = this.animations['idleDown'];
                else if (this.state === 'walkLeft') this.currAnimation = this.animations['idleLeft'];
                else if (this.state === 'walkRight') this.currAnimation = this.animations['idleRight'];
                break;

            case 'w':
                changeY = true;
                this.state = 'walkUp';
                this.speed = -200;
                this.currAnimation = this.animations['walkUp'];
                break;

            case 'a':
                changeX = true;
                this.state = 'walkLeft';
                this.speed = -200;
                this.currAnimation = this.animations['walkLeft'];
                break;

            case 's':
                changeY = true;
                this.state = 'walkDown';
                this.speed = 200;
                this.currAnimation = this.animations['walkDown'];
                break;

            case 'd':
                changeX = true;
                this.state = 'walkRight';
                this.speed = 200;
                this.currAnimation = this.animations['walkRight'];
                break;

            case 'j':
                if(this.state === 'walkUp') this.currAnimation = this.animations['daggerUp'];
                else if(this.state === 'walkDown') this.currAnimation = this.animations['daggerDown'];
                else if(this.state === 'walkLeft') this.currAnimation = this.animations['daggerLeft'];
                else if(this.state === 'walkRight') this.currAnimation = this.animations['daggerRight'];
                break;

            case ' ':
                if(this.titleScreenComp) {
                    this.x = 50;
                }
                break;
    }

    }

    if (changeX) {
        console.log("X changed:" + this.x + ", " + this.y);
        this.x += this.game.clockTick * this.speed;
    } else if (changeY) {
        console.log("Y changed:" + this.x + ", " + this.y);
        this.y += this.game.clockTick * this.speed;
    }

    if (this.x > 1024) {
        this.x = -64
    } else if (this.x < -64) {
        this.x = 1024;
    } else if (this.y > 1088) {
        this.y = 0;
    } else if (this.y < 0) {
        this.y = 1088;
    }

    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

//! ******** Retrieve Assets & Start Game ******** */
ASSET_MANAGER.queueDownload("./res/map/proto_map.jpg");
ASSET_MANAGER.queueDownload("./res/character/skeleton_dagger.png");
ASSET_MANAGER.queueDownload("./res/audio/megalovania.mp3");
ASSET_MANAGER.queueDownload("./res/map/titlescreen.jpg");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    console.log('starting audio');

    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.startInput();

    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/titlescreen.jpg")));
    gameEngine.addEntity(new SkeletonDagger(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_dagger.png")));
});
