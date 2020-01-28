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
    // var frame = this.currentFrame();
    // var xindex = 0;
    // var yindex = 0;
    // var xindex = frame % this.sheetWidth;
    // var yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet, 
        this.startX + (this.currentFrame() * this.frameWidth),
        this.startY, 
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
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
};

//! ******** Skeleton Dagger Sprite Definition ******** */
function SkeletonDagger(game, spritesheet) {
    // this.animations = this.setupAnimations(spritesheet);
    this.x = 50;
    this.y = 50;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    // this.facing = "down";
    this.state = "walkDown";

    this.testAnimation = new Animation(spritesheet, 0, 386, 64, 62, 512, 0.5, 8, true, 1);
}

SkeletonDagger.prototype = new Entity();
SkeletonDagger.prototype.constructor = SkeletonDagger;

SkeletonDagger.prototype.setupAnimations = function (spriteSheet) {
    let returnedAnimations = [];
    let directions = ["Up", "Left", "Down", "Right"];
    let type;
    let stX = 0;
    let stY = 0;
    let width = 64;
    let height = 62;
    let sheetWidth;
    let duration = 0.5;
    let numFrames;
    let loop = true;
    let scale = 1;

    //Add Spellcast animations:
    type = "spell";
    numFrames = 7;
    sheetWidth = width * numFrames;
    for (let i = 0; i < 4; i++) {
        returnedAnimations[type + directions[i]] = new Animation(spriteSheet, stX, stY, width, height, sheetWidth, duration, numFrames, loop, scale);
        stY += 64;
    }

    //Add thrust animations:
    type = "thrust";
    numFrames = 8;
    sheetWidth = width * numFrames;
    for (let i = 0; i < 4; i++) {
        returnedAnimations[type + directions[i]] = new Animation(spriteSheet, stX, stY, width, height, sheetWidth, duration, numFrames, loop, scale);
        stY += 64;
    }

    //Add thrust animations:
    type = "walk";
    numFrames = 9;
    sheetWidth = width * numFrames;
    for (let i = 0; i < 4; i++) {
        returnedAnimations[type + directions[i]] = new Animation(spriteSheet, stX, stY, width, height, sheetWidth, duration, numFrames, loop, scale);
        stY += 64;
    }

    return returnedAnimations;
};

SkeletonDagger.prototype.update = function () {
    let changeX = false;
    let changeY = false;
    // console.log(this.game.userInput);
    switch (this.game.userInput) {
        case 'idle':
            this.state = 'idle';
            this.speed = 0;
            break;
        case 'w':
            changeY = true;
            this.state = 'walkUp';
            this.speed = -200;
            break;
        case 'a':
            changeX = true;
            this.state = 'walkLeft';
            this.speed = -200;
            break;
        case 's':
            changeY = true;
            this.state = 'walkDown';
            this.speed = 200;
            break;
        case 'd':
            changeX = true;
            this.state = 'walkRight';
            this.speed = 200;
            break;
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
}

SkeletonDagger.prototype.draw = function () {
    // console.log(this.state.toString());
    // this.animations[this.state.toString()].drawFrame(this, this.ctx, this.x, this.y);

    this.testAnimation.drawFrame(this, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//! ******** Retrieve Assets & Start Game ******** */
ASSET_MANAGER.queueDownload("./res/map/proto_map.jpg");
ASSET_MANAGER.queueDownload("./res/character/skeleton_dagger.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.startInput();

    //TODO define SkeletonDagger
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./res/map/proto_map.jpg")));
    gameEngine.addEntity(new SkeletonDagger(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_dagger.png")));
});