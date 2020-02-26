function Terrain(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.hitbox = undefined;
}

Terrain.prototype.update = function () {
};

Terrain.prototype.draw = function (entity) {
    if(!ON_TITLESCREEN && !GAME_OVER) {
        entity.ctx.drawImage(entity.spriteSheet, entity.x, entity.y, entity.width, entity.height);
        Entity.prototype.draw.call(entity);
    }
};

/**
 * Sets an terrain entity's (x,y) coordinates to a random location on the map based on the map dimensions.
 *
 * @param entity The terrain entity to set coordinates for.
 * @param mapWidth The width of the map.
 * @param mapHeight The height of the map.
 */
function setRandomLocation(entity, mapWidth, mapHeight) {
    let padding = 80;
    let isColliding = true;
    entity.x = Math.floor(Math.random() * ((mapWidth - entity.width - padding) - padding + 1)) + padding;
    entity.y = Math.floor(Math.random() * ((mapHeight - entity.height - padding) - padding + 1)) + padding;

    if (entity.game.terrain.length === 0) {
        isColliding = false;
    }
    while (isColliding) {
        for (let i = 0; i < entity.game.terrain.length; i++) {
            let other = entity.game.terrain[i];
            isColliding = entity.x < other.x + other.width
                && entity.x + entity.width > other.x
                && entity.y < other.y + other.height
                && entity.y + entity.height > other.y;
            if (isColliding) {
                console.log('Fixing terrain collision');
                entity.x = Math.floor(Math.random() * ((mapWidth - entity.width - padding) - padding + 1)) + padding;
                entity.y = Math.floor(Math.random() * ((mapHeight - entity.height - padding) - padding + 1)) + padding;
            }

        }
    }

    entity.spawnX = entity.x;
    entity.spawnY = entity.y;
}

/*** Forest Terrain Objects ***/

function Rock1(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y + 18, this.height - 22, this.width, true);
}

Rock1.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 8, 22, 46, 12);
};

Rock1.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function Rock2(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 32;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height - 18, this.width, true);
}

Rock2.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 12, 20, 14, 10);
};

Rock2.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DirtHole(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 96;
    this.height = 96;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DirtHole.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 20, -3, 60, 42);
};

DirtHole.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function IvyColumn(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 32;
    this.height = 128;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

IvyColumn.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 0, 92, 32, 1);
};

IvyColumn.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function ConiferousTree(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 96;
    this.height = 192;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

ConiferousTree.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

ConiferousTree.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

/* Desert Terrain Objects */
function BigCactus(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

BigCactus.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

BigCactus.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertRockLarge(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertRockLarge.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertRockLarge.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertRockSmall(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertRockSmall.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertRockSmall.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertSpikesDark(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertSpikesDark.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertSpikesDark.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertSpikesLight(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertSpikesLight.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertSpikesLight.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertRubble(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertRubble.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertRubble.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

function DesertRiver(game, spriteSheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.spriteSheet = spriteSheet;
    this.x = 0;
    this.y = 0;
    this.spawnX = 0;
    this.spawnY = 0;
    this.width = 64;
    this.height = 64;
    Entity.call(game, this.x, this.y, undefined);
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
}

DesertRiver.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateTerrainHitbox(this, 38, 86, 20, 30);
};

DesertRiver.prototype.draw = function () {
    Terrain.prototype.draw(this);
};
