//! ******** UI Element Definitions ******** */
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