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
    if(!ON_TITLESCREEN) {
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
    let padding = 20;
    entity.x = Math.floor(Math.random() * ((mapWidth - padding) - padding + 1)) + padding;
    entity.y = Math.floor(Math.random() * ((mapHeight - padding) - padding + 1)) + padding;
    entity.spawnX = entity.x;
    entity.spawnY = entity.y;
    console.log('Set terrain to x:' + entity.x + ' y:' + entity.y);
}

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
    updateTerrainHitbox(this, 0, 18, 64, 44);
};

Rock1.prototype.draw = function () {
    Terrain.prototype.draw(this);
};

