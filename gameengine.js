/**
 * Requests the animation frame of the user's browser, using an extended OR clause for compatibility with
 * a wide array of browsers.
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~ GAME ENGINE FUNCTIONS ~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 * Creates a new GameEngine object, the fundamental mechanism that drives the game.
 *
 * @constructor
 */
function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.userInput = null;  // TODO: Only allows for one input at a time, should be reworked into a list.
}

/**
 * Initializes the GameEngine to default state. Called immediately after GameEngine instantiation.
 *
 * @param ctx The web page context the GameEngine will work on.
 */
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.userInput = 'idle';
    this.timer = new Timer();
    console.log('game initialized');
};

/**
 * Kicks off the main loop that the engine runs on. Called after initialization.
 */
GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

/**
 * Adds event listeners to the engine that will listen for key and mouse events, allowing the GameEngine
 * to receive user input and react accordingly.
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting User Input');
    const that = this;

    /* Key Press Listeners */
    this.ctx.canvas.addEventListener("keydown", function (e) {
        switch (e.key) {
            case 'w':   // Up
                that.userInput = 'w';
                console.log('Key press: ' + e.key);
                break;

            case 's':   // Down
                that.userInput = 's';
                console.log('Key press: ' + e.key);
                break;

            case 'a':   // Left
                that.userInput = 'a';
                console.log('Key press: ' + e.key);
                break;

            case 'd':   // Right
                that.userInput = 'd';
                console.log('Key press: ' + e.key);
                break;

            case 'f':
                that.userInput = 'f';
                console.log("Key press: " + e.key);
                break;

            case 'j':
                that.userInput = 'j';
                console.log("Key press: " + e.key);
                break;
                
            default:
                console.log('Invalid user input.');
                break;

        }
    }, true);

    /* Key Release Listeners */
    this.ctx.canvas.addEventListener("keyup", function (e) {
        switch (e.key) {
            case 'w':   // Up
                that.userInput = 'idle';
                console.log('Key released: ' + e.key);
                break;

            case 's':   // Down
                that.userInput = 'idle';
                console.log('Key released: ' + e.key);
                break;

            case 'a':   // Left
                that.userInput = 'idle';
                console.log('Key released: ' + e.key);
                break;

            case 'd':   // Right
                that.userInput = 'idle';
                console.log('Key released: ' + e.key);
                break;

            case 'j':
                that.userInput = 'idle';
                console.log('Key released: ' + e.key);
                break;
        }
    }, false);
};

/**
 * Adds an entity to the GameEngine's list of entities.
 *
 * @param entity The entity to be added to the list of entities.
 */
GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
};

/**
 * Clears the canvas and redraws all entities. Called after all entities have updated themselves.
 */
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

/**
 * Updates the entity count and requests that all entities update themselves based on the next game tick.
 */
GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

/* ~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~ TIMER FUNCTIONS ~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
// TODO: Separate timer functions into their own class if desired.

/**
 * Creates a new Timer object.
 *
 * The Timer serves as the clock and primary mechanism of synchronization for the GameEngine.
 * @constructor
 */
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

/**
 * Advances the Timer by one tick.
 *
 * @returns {number}
 */
Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~ ENTITY FUNCTIONS ~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~ */
// TODO: Separate entity functions into their own class if desired.

/**
 * Creates a new Entity object.
 * Entity objects serve as the basic form an agent within the game can exist as.
 *
 * @param game The GameEngine the Entity will be created within.
 * @param x Starting X coordinate position.
 * @param y Starting Y coordinate position.
 *
 * @constructor
 */
function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

/**
 * //TODO: Do we need this stub?
 */
Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}