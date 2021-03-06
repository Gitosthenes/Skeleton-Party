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
    this.paused = false;
    this.entities = [];
    this.player = null;
    this.background = undefined;
    this.enemies = [];
    this.terrain = [];
    this.drawables = [];
    this.projectiles = [];
    this.powerups = [];
    this.timerSpawns = 0;
    this.onTitleScreen = true;
    this.levelComplete = false;
    this.gameOver = false;
    this.levelCount = 7;
    this.currentLevel = 0;
    this.mapOrder = ['title', 'instructions', 'forest', 'desert', 'graveyard', 'cave','castle'];
    //begin ui stuff
    this.volumeToggle = null;
    this.healthUI = null;
    this.defUI = null;
    this.atkUI = null;
    this.enemyUI = null;
    this.timerUI = null;
    //end ui stuff
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.userInput = [];
    // Enemy spawning variables.
    this.currentSpawnCount = 0;
    this.enemyCount = 0;
    this.spawnMax = 0;
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

GameEngine.prototype.pauseResumeEngine = function () {
    if (this.paused) {
        this.paused = false;
    } else {
        this.paused = true;
    }
}

/**
 * Adds event listeners to the engine that will listen for key and mouse events, allowing the GameEngine
 * to receive user input and react accordingly.
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting User Input');
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
        let key = e.key.toLowerCase();
        switch (key) {
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

            case 'k':
                checkPressInput('k');
                break;

            case 'm':
                checkPressInput('m');
                break;

            case ' ':
                checkPressInput(' ');
                break;

            case 'p':
                checkPressInput('p');
                break;
            
            case 'enter':
                that.pauseResumeEngine();
                break;
        }
    }, true);

    /* Key Release Listeners */
    this.ctx.canvas.addEventListener("keyup", function (e) {
        let key = e.key.toLowerCase();
        switch (key) {
            case 'w':   // Up
                checkReleaseInput(key);
                break;

            case 's':   // Down
                checkReleaseInput(key);
                break;

            case 'a':   // Left
                checkReleaseInput(key);
                break;

            case 'd':   // Right
                checkReleaseInput(key);
                break;

            case 'j':
                checkReleaseInput(key);
                break;

            case 'k':
                checkReleaseInput(key);
                break;

            case 'm':
                checkReleaseInput(key);
                break;

            case ' ':
                checkReleaseInput(key);
                break;

            case 'p':
                checkReleaseInput(key);
                break;
        }
    }, false);

    /* Mouse Listeners*/
    this.ctx.canvas.addEventListener('mouseup', function (e) {
        //volume icon bounds
        console.log("click x = " + e.clientX + "click y = " + e.clientY);
        let top_left = 907;
        let bot_right = 688;
        if (e.clientX > 907 && e.clientY > 600) {
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

GameEngine.prototype.setHealthUI = function (healthUI) {
    this.healthUI = healthUI;
}

GameEngine.prototype.setDefUI = function (defUI) {
    this.defUI = defUI;
}

GameEngine.prototype.setAtkUI = function (atkUI) {
    this.atkUI = atkUI;
}

GameEngine.prototype.setEnemyUI = function (enemyUI) {
    this.enemyUI = enemyUI;
}

GameEngine.prototype.setTimerUI = function (timerUI) {
    this.timerUI = timerUI;
}
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

GameEngine.prototype.addProjectile = function(entity) {
    this.projectiles.push(entity)
};

GameEngine.prototype.addPowerUp = function(entity) {
    this.powerups.push(entity)
};

GameEngine.prototype.setBackground = function (mapFunction) {
    this.background = mapFunction;
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

    this.drawables = [];
    this.drawables.push(this.player);
    for (let i = 0; i < this.terrain.length; i++) {     // Draw all terrain entities.
        //this.terrain[i].draw(this.ctx);
        this.drawables.push(this.terrain[i]);
    }
    for (let i = 0; i < this.enemies.length; i++) {     // Draw all enemies.
        //this.enemies[i].draw(this.ctx);
        this.drawables.push(this.enemies[i]);
    }
    for (let i = 0; i < this.projectiles.length; i++) {     // Draw all projectiles.
        //this.enemies[i].draw(this.ctx);
        this.drawables.push(this.projectiles[i]);
    }
    for (let i = 0; i < this.powerups.length; i++) {
        this.drawables.push(this.powerups[i]);
    }
    this.drawables.sort( (a,b) => parseFloat(a.hitbox.y) - parseFloat(b.hitbox.y));
    for (let i = 0; i < this.drawables.length; i++) {
        this.drawables[i].draw(this.ctx);
    }

    this.volumeToggle.draw(this.ctx);   // Start drawing UI elements.a
    this.healthUI.draw(this.ctx);
    this.defUI.draw(this.ctx);
    this.atkUI.draw(this.ctx);
    this.enemyUI.draw(this.ctx);
    this.timerUI.draw(this.ctx);
    this.ctx.restore();
};

/**
 * Updates the entity count and requests that all entities update themselves based on the next game tick.
 */
GameEngine.prototype.update = function () {
    this.player.update();
    this.background.update();
    this.volumeToggle.update();
    this.healthUI.update();
    this.defUI.update();
    this.atkUI.update();
    this.enemyUI.update();
    this.timerUI.update();
    this.updateEnemyCount();

    if (!this.levelComplete) {
        if (this.timerSpawns < 6) {
            chanceSpawnTimer(this);
        }
    }

    if (this.userInput.includes(' ') && this.currentLevel === 0) {
        if(this.onTitleScreen) {
            this.setBackground(mapSetUp(this, ASSET_MANAGER, 'instructions'));
            document.getElementById('audio').play();
            document.getElementById('audio').volume = 0.5;
            this.onTitleScreen = true;
            this.currentLevel++;
        }
    }
    else if (this.userInput.includes(' ') && this.currentLevel === 1) {
        this.setBackground(mapSetUp(this, ASSET_MANAGER, 'forest'));
        document.getElementById('audio').play();
        document.getElementById('audio').volume = 0.5;
        this.onTitleScreen = false;
        this.currentLevel++;
    }
    else {
        if (this.enemyCount <= 0 && this.currentLevel > 1) {
            this.levelComplete = true;
            this.powerups = []; // Clear the powerups on level end so they don't draw over the transition screen.
            if (this.currentLevel + 1 >= this.levelCount) {
                if (this.userInput.includes(' ')) {
                    this.resetGame();
                }
                // TODO: Add win splash screen here
            } else if (this.userInput.includes(' ') && this.currentLevel > 1) { // Waiting for next level.
                this.currentLevel++;
                this.setBackground(mapSetUp(this, ASSET_MANAGER, this.mapOrder[this.currentLevel]));
            }
        }
        else if (this.gameOver && this.userInput.includes(' ')) this.resetGame();
    }
    for (let i = 0; i < this.enemies.length; i++) { //enemies
        let enemy = this.enemies[i];
        if(!enemy.removeFromWorld) {
            this.enemies[i].update();
        }
    }
    for (let i = 0; i < this.projectiles.length; i++) { //projectiles
        let projectile = this.projectiles[i];
        if(!projectile.removeFromWorld) {
            this.projectiles[i].update();
        }
    }
    for (let i = 0; i < this.powerups.length; i++) {
        let powerup = this.powerups[i];
        if (!powerup.removeFromWorld) {
            this.powerups[i].update();
        }
    }
    for (let i = 0; i < this.terrain.length; i++) { //terrain
        this.terrain[i].update();
    }
    for (let i = 0; i < this.entities.length; i++) { //entities
        this.entities[i].update();
    }
    for (var i = this.enemies.length - 1; i >= 0; --i) {
        let enemy = this.enemies[i];
        if (enemy.removeFromWorld) {
            this.enemies.splice(i, 1);
        }
    }
    for (var i = this.projectiles.length - 1; i >= 0; --i) {
        let projectile = this.projectiles[i];
        if (projectile.removeFromWorld) {
            this.projectiles.splice(i, 1);
        }
    }
    for (let i = this.powerups.length - 1; i >= 0; --i) {
        let powerup = this.powerups[i];
        if (powerup.removeFromWorld) {
            this.powerups.splice(i, 1);
        }
    }
};

/**
 * Main game loop for the engine. Perpetually calls for entities to update and draw.
 */
GameEngine.prototype.loop = function () {
    if(!this.paused) {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
};

GameEngine.prototype.clearEntities = function () {
    this.enemies = [];
    this.terrain = [];
    this.enemies = [];
    this.powerups = [];
    this.projectiles = [];
    this.timerSpawns = 0;
};

GameEngine.prototype.updateEnemyCount = function () {
    if (this.currentSpawnCount < this.spawnMax && this.enemyCount >= this.spawnMax) {
        let enemy;
        for (let i = 0; i < this.enemies.length; i++) {
            enemy = this.enemies[i];
            if (!enemy.isActive) {
                enemy.isActive = true;
                enemy.hitbox.isActive = true;
                enemy.currRange = enemy.attkRange;
                this.currentSpawnCount++;
                break;
            }
        }
    }
};

GameEngine.prototype.setEnemyHealth = function () {
    switch (this.mapOrder[this.currentLevel]) {
        case 'forest':
            for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].enemyHP = 100; }
            break;
        case 'desert':
            for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].enemyHP = 120; }
            break;
        case 'graveyard':
            for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].enemyHP = 140; }
            break;
        case 'cave':
            for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].enemyHP = 160; }
            break;
        case 'castle':
            for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].enemyHP = 210; }
            break;
    }
};

GameEngine.prototype.resetPlayerPosition = function () {
    bgX = 0;
    bgY = 0;
    playerX = 0;
    playerY = 0;
    this.background.x = 0;
    this.background.y = 0;
    this.player.hitbox = new Hitbox(this.player.x, this.player.y, 35, 32, true);
};

GameEngine.prototype.resetGame = function () {
    console.log('resetting game');
    let currMap = this.mapOrder[this.currentLevel];
    this.enemyCount = 0;
    this.spawnMax = 0;
    this.currentSpawnCount = 0;
    this.clearEntities();
    this.levelComplete = false;
    this.gameOver = false;
    this.player.isDead = false;
    this.player.baseSpeed = 300;
    time = 40;
    hp = 100;
    this.setBackground(mapSetUp(this, ASSET_MANAGER, currMap));
};

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
function Entity(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    this.removeFromWorld = false;
}

/**
 * //TODO: Do we need this stub?
 */
Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
    // if (this.hitbox !== undefined) drawDebugHitbox(this);
    // if (this.hurtbox !== undefined) drawDebugHurtbox(this);
};
