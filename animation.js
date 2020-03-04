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

//! ******** Initialization Functions ******** */
function entityAnimationInit(speed, spritesheetSword, spritesheetBow, type) {
    let animations = [];

    /* Walking animations. */
    animations['walkUp'] = new Animation(spritesheetSword, 0, 512, 64, 62, 9, 0.15, 9, true, 1);
    animations['walkDown'] = new Animation(spritesheetSword, 0, 640, 64, 62, 9, 0.15, 9, true, 1);
    animations['walkLeft'] = new Animation(spritesheetSword, 0, 576, 64, 62, 9, 0.15, 9, true, 1);
    animations['walkRight'] = new Animation(spritesheetSword, 0, 704, 64, 62, 9, 0.15, 9, true, 1);

    switch(type) {
        case 1: //For large attack spritesheets with idle
            /* Idle animations. */
            animations['idleUp'] = new Animation(spritesheetSword, 0, 0, 64, 62, 512, 0.6, 2, true, 1);
            animations['idleDown'] = new Animation(spritesheetSword, 0, 128, 64, 62, 512, 0.5, 2, true, 1);
            animations['idleLeft'] = new Animation(spritesheetSword, 0, 64, 64, 62, 512, 0.6, 2, true, 1);
            animations['idleRight'] = new Animation(spritesheetSword, 0, 192, 64, 62, 512, 0.6, 2, true, 1);

            /* Attack animations. */
            animations['attackUp'] = new Animation(spritesheetSword, 62, 1411, 189, 121, 6, speed, 6, true, 1);
            animations['attackDown'] = new Animation(spritesheetSword, 64, 1790, 189, 121, 6, speed, 6, true, 1);
            animations['attackLeft'] = new Animation(spritesheetSword, 66, 1603, 189, 121, 6, speed, 6, true, 1);
            animations['attackRight'] = new Animation(spritesheetSword, 66, 1985, 189, 121, 6, speed, 6, true, 1);

            //bow attack
            animations['attackBowUp'] = new Animation(spritesheetBow, 0, 1025, 64, 62, 13, speed, 13, true, 1);
            animations['attackBowLeft'] = new Animation(spritesheetBow, 0, 1089, 64, 60, 13, speed, 13, true, 1);
            animations['attackBowDown'] = new Animation(spritesheetBow, 0, 1149, 64, 62, 13, speed, 13, true, 1);
            animations['attackBowRight'] = new Animation(spritesheetBow, 0, 1215, 64, 60, 13, speed, 13, true, 1);
            break;

        case 2: //For small attack spritesheets w/o idle
            /* Attack animations. */
            animations['attackUp'] = new Animation(spritesheetSword, 0, 258, 64, 62, 6, speed, 6, true, 1);
            animations['attackDown'] = new Animation(spritesheetSword, 0, 387, 64, 62, 6, speed, 6, true, 1);
            animations['attackLeft'] = new Animation(spritesheetSword, 0, 322, 64, 62, 6, speed, 6, true, 1);
            animations['attackRight'] = new Animation(spritesheetSword, 0, 450, 64, 62, 6, speed, 6, true, 1);
            break;

        case 3: // Small Dagger Attacks
            animations['attackUp'] = new Animation(spritesheetSword, 0, 768, 64, 62, 6, speed, 6, true, 1);
            animations['attackDown'] = new Animation(spritesheetSword, 0, 896, 64, 62, 6, speed, 6, true, 1);
            animations['attackLeft'] = new Animation(spritesheetSword, 0, 832, 62, 62, 6, speed, 6, true, 1);
            animations['attackRight'] = new Animation(spritesheetSword, 4, 960, 64, 62, 6, speed, 6, true, 1);
            break;
    }

  //dying animation
  animations['dying'] = new Animation(spritesheetSword, 0, 1290, 64, 62, 6, 0.2, 6, false, 1);

  return animations;
}

/**
 * Attaches weapon FX animations to entity.
 * 
 * @param entity the entity to give FX animations to.
 * @param spritesheet weapon FX spritesheet
 * @param type determines which animation to attach to entity
 */
function altAnimationInit(speed, spritesheet, type) {
    let animations = [];
    
    //Universal FX
        /* none yet  */
    
    switch(type) {
        case 1: //Slash animation
            animations['slashRight'] = new Animation(spritesheet, 0, 0, 165, 68, 660, speed, 4, true, 1);
            animations['slashLeft'] = new Animation(spritesheet, 0, 70, 165, 68, 660, speed, 4, true, 1);
            animations['slashUp'] = new Animation(spritesheet, 0, 139, 176, 49, 704, speed, 4, true, 1);
            animations['slashDown'] = new Animation(spritesheet, 0, 189, 176, 49, 704, speed, 4, true, 1);
            break;
    }

    return animations;
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