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

// function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
            //bow attack
            animations['attackBowUp'] = new Animation(spritesheetBow, 0, 1025, 64, 62, 13, speed, 13, true, 1);
            animations['attackBowLeft'] = new Animation(spritesheetBow, 0, 1089, 64, 60, 13, speed, 13, true, 1);
            animations['attackBowDown'] = new Animation(spritesheetBow, 0, 1150, 64, 62, 13, speed, 13, true, 1);
            animations['attackBowRight'] = new Animation(spritesheetBow, 0, 1217, 64, 60, 13, speed, 13, true, 1);
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
function altAnimationInit(totAttkTime, spritesheet, type) {
    let animations = [];

    //Universal FX
        /* none yet  */

    switch(type) {
        case 'slice':
            animations['sliceRight'] = new Animation(spritesheet, 0, 646, 75, 29, 450, totAttkTime, 6, true, 1.75);
            animations['sliceLeft'] = new Animation(spritesheet, 0, 675, 75, 29, 450, totAttkTime, 6, true, 1.75);
            animations['sliceUp'] = new Animation(spritesheet, 0, 704, 62, 43, 310, totAttkTime, 5, true, 2);
            animations['sliceDown'] = new Animation(spritesheet, 0, 747, 62, 43, 310, totAttkTime, 5, true, 2);
            break;
        case 'slash':
            animations['slashRight'] = new Animation(spritesheet, 0, 0, 165, 68, 660, totAttkTime, 4, true, 0.7);
            animations['slashLeft'] = new Animation(spritesheet, 0, 70, 165, 68, 660, totAttkTime, 4, true, 0.7);
            animations['slashUp'] = new Animation(spritesheet, 0, 139, 176, 49, 704, totAttkTime, 4, true, 1);
            animations['slashDown'] = new Animation(spritesheet, 0, 189, 176, 49, 704, totAttkTime, 4, true, 1);
            break;
        case 'thrust':
            let speed = totAttkTime - (totAttkTime / ANIMATION_DELAY_FACTOR);
            animations['thrustRight'] = new Animation(spritesheet, 0, 240, 152, 48, 1216, speed, 8, true, 0.85);
            animations['thrustLeft'] = new Animation(spritesheet, 0, 288, 152, 48, 1216, speed, 8, true, 0.85);
            animations['thrustUp'] = new Animation(spritesheet, 0, 336, 48, 152, 384, speed, 8, true, 0.6);
            animations['thrustDown'] = new Animation(spritesheet, 0, 490, 48, 152, 384, speed, 8, true, 0.6);
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

/**
 * Returns offsets used to draw weapon FX based on attak type
 *
 * @param type attack type of entity
 * @returns object that contains x and y offsets to use when drawing FX
 */
function setupFXoffsets(type) {
    let uX = uY = dX = dY = lX = lY = rX = rY = 0;
    let offsets = [];

    switch(type) {
        case 'slice':
            uX =  -5; uY = -55;
            dX =  -5; dY =  30;
            lX = -55; lY =   0;
            rX =  -5; rY =   0;

            offsets['up'] = {x: uX, y: uY };
            offsets['down'] = {x: dX, y: dY };
            offsets['left'] = {x: lX, y: lY };
            offsets['right'] = {x: rX, y: rY };
            break;

        case 'slash':
            uX = -45; uY = -35;
            dX = -45; dY =  50;
            lX = -50; lY =  10;
            rX =   0; rY =  10;

            offsets['Up'] = {x: uX, y: uY };
            offsets['Down'] = {x: dX, y: dY };
            offsets['Left'] = {x: lX, y: lY };
            offsets['Right'] = {x: rX, y: rY };
            break;

        case 'thrust':
            uX = 15; uY = -65;
            dX = 13; dY =  40;
            lX = -65; lY =  25;
            rX =   0; rY =  25;

            offsets['Up'] = {x: uX, y: uY };
            offsets['Down'] = {x: dX, y: dY };
            offsets['Left'] = {x: lX, y: lY };
            offsets['Right'] = {x: rX, y: rY };
            break;
    }

    return offsets;
}
