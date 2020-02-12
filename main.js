let ASSET_MANAGER = new AssetManager();

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
    entityAnimationInit(this, spritesheet);
    this.x = -250;
    this.y = 50;
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
    this.hitbox = new Hitbox(this.x, this.y, 62, 64);
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
    checkForCollisions(this);


    if (this.changeX) {
        this.x += this.game.clockTick * this.xSpeed;
    }
    if (this.changeY) {
        this.y += this.game.clockTick * this.ySpeed;
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

    this.changeX = this.changeY = false;
    Entity.prototype.update.call(this);
};

SkeletonDagger.prototype.draw = function () {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    drawDebugHitbox(this);
    Entity.prototype.draw.call(this);
};

function MaleKnightSpear(game,spritesheet) {
    //this.ani = new entityAnimationInit(this, spritesheet);
    this.x = -100;
    this.y = 80;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.state = "walkDown";
    this.titleScreenComp = true;
    this.currAnimation = new Animation(spritesheet, 0, 384, 64, 62, 512, 0.1, 8, true, 1);
}

MaleKnightSpear.prototype.update = function() {
    let key = this.game.userInput[0];
    switch (key) {
        case ' ':
            this.x = 650;
            break;
    }
    Entity.prototype.update.call(this);
}

MaleKnightSpear.prototype.draw = function() {
    this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function MaleKnightMace(game,spritesheet) {
    this.x = -100;
    this.y = 80;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.direction = 'down';
    this.state = "walkDown";
    this.titleScreenComp = true;
    this.currAnimation = new Animation(spritesheet, 0, 1744, 190, 123, 6, 0.1, 6, true, 1);
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


//! ******** Retrieve Assets & Start Game ******** */
ASSET_MANAGER.queueDownload("./res/map/proto_map.jpg");
ASSET_MANAGER.queueDownload("./res/character/skeleton_dagger.png");
ASSET_MANAGER.queueDownload("./res/audio/megalovania.mp3");
ASSET_MANAGER.queueDownload("./res/map/titlescreen.jpg");
ASSET_MANAGER.queueDownload("./res/character/male_knight_spear.png");
ASSET_MANAGER.queueDownload("./res/character/male_knight_mace.png");



ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    console.log('starting audio');

    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.startInput();

    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/titlescreen.jpg")));
    gameEngine.addEntity(new MaleKnightSpear(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_spear.png")));
    gameEngine.addEntity(new MaleKnightMace(gameEngine, ASSET_MANAGER.getAsset("./res/character/male_knight_mace.png")));
    gameEngine.addEntity(new SkeletonDagger(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_dagger.png")));
});
