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
    this.player = null;
    this.background = null;
    this.enemies = [];
    this.terrain = [];
    this.volumeToggle = null;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.userInput = [];
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
    this.timer = new Timer();
    //console.log('game initialized');
};

/**
 * Kicks off the main loop that the engine runs on. Called after initialization.
 */
GameEngine.prototype.start = function () {
    //console.log("starting game");
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
    //console.log('Starting User Input');
    let that = this;

    let checkPressInput = function (key) {
        if (!that.userInput.includes(key)) {
            that.userInput.push(key);
        }
    };

    let checkReleaseInput = function (key) {
        if (that.userInput.includes(key)) {
            let index = that.userInput.indexOf(key);
            if (index !== -1) that.userInput.splice(index, 1);
        }
    };

    /* Key Press Listeners */
    this.ctx.canvas.addEventListener("keydown", function (e) {
        switch (e.key) {
            case 'w':   // Up
                checkPressInput('w');
                break;

            case 's':   // Down
                checkPressInput('s');
                break;

            case 'a':   // Left
                checkPressInput('a');
                break;

            case 'd':   // Right
                checkPressInput('d');
                break;

            case 'j':
                checkPressInput('j');
                break;

            case 'm':
                checkPressInput('m');
                break;

            case ' ':
                checkPressInput(' ');
                break;
        }
    }, true);

    /* Key Release Listeners */
    this.ctx.canvas.addEventListener("keyup", function (e) {
        switch (e.key) {
            case 'w':   // Up
                checkReleaseInput(e.key);
                break;

            case 's':   // Down
                checkReleaseInput(e.key);
                break;

            case 'a':   // Left
                checkReleaseInput(e.key);
                break;

            case 'd':   // Right
                checkReleaseInput(e.key);
                break;

            case 'j':
                checkReleaseInput(e.key);
                break;

            case 'm':
                checkReleaseInput(e.key);
                break;

            case ' ':
                checkReleaseInput(e.key);
                break;
        }
    }, false);

    /* Mouse Listeners*/
    this.ctx.canvas.addEventListener('mouseup', function (e) {
        //volume icon bounds
        let top_left = 15;
        let bot_right = 45;
        if (e.clientX > top_left
            && e.clientX < bot_right
            && e.clientY > top_left
            && e.clientY < bot_right) {
                that.volumeToggle.flipVolume();
        }
    }, false);
};

/**
 * Attaches volume toggle object to game engine.
 *
 * @param volumeToggle the volume toggle object to attach.
 */
GameEngine.prototype.setVolumeToggle = function (volumeToggle) {
    this.volumeToggle = volumeToggle;
};

/**
 * Adds an entity to the GameEngine's list of entities.
 *
 * @param entity The entity to be added to the list of entities.
 */
GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
};

GameEngine.prototype.addEnemy = function (entity) {
    this.enemies.push(entity);
};

GameEngine.prototype.addTerrain = function (entity) {
    this.terrain.push(entity);
};

GameEngine.prototype.setBackground = function (entity) {
    this.background = entity;
};

GameEngine.prototype.setPlayer = function (entity) {
    this.player = entity;
};

/**
 * Clears the canvas and redraws all entities. Called after all entities have updated themselves.
 */
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    this.background.draw(this.ctx);    // Draw background.
    this.player.draw(this.ctx);             // Draw player.
    this.volumeToggle.draw(this.ctx);
    for (let i = 0; i < this.enemies.length; i++) {     // Draw all enemies.
        this.enemies[i].draw(this.ctx);
    }
    for (let i = 0; i < this.terrain.length; i++) {     // Draw all terrain entities.
        this.terrain[i].draw(this.ctx);
    }
    this.ctx.restore();
};

/**
 * Updates the entity count and requests that all entities update themselves based on the next game tick.
 */
GameEngine.prototype.update = function () {
    this.player.update();
    this.background.update();
    this.volumeToggle.update();
    for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update();
    }
    for (let i = 0; i < this.terrain.length; i++) {
        this.terrain[i].update();
    }
    for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].update();
    }
};

/**
 * Main game loop for the engine. Perpetually calls for entities to update and draw.
 */
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
    drawDebugHitbox(this);
};
