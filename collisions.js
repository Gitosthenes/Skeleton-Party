/**
 * Creates a new Hitbox object that entities use to determine and handle collision.
 *
 * @param x The X coordinate of the hitbox in the game.
 * @param y The Y coordinate of the hitbox in the game.
 * @param h The height of the hitbox.
 * @param w The width of the hitbox.
 * @constructor
 */
function Hitbox(x, y, h, w) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
}

/**
 * Calculates and returns the distance between two entities using their X and Y coordinate within the game.
 *
 * @param a An entity to check distance between.
 * @param b Another entity to check distance between.
 * @returns {number}
 */
function distance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkForCollisions(entity) {
    // Check directions that the entity is moving for if they have reached level boundaries.

    // TODO: Change game engine to distinguish between npc entities and obstacle/game world entities.
    // Check against all other entities for collision against them.
    for (let i = 0; i < entity.game.entities.length; i++) {
        let otherEntity = entity.game.entities[i];
        if (this.hasCollided(this, otherEntity)) {
            // TODO: Handle the collision between player and enemy entity.
            console.log('Collision detected!');
        }
    }
}

/**
 * Determines whether or not two hitboxes have intersected and returns a boolean result.
 *
 * @param a The first hitbox to compare.
 * @param b The second hitbox to compare.
 * @returns {boolean}
 */
function hasCollided(a, b) {
    return (a.x < b.x + b.width     //
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y);
}

/**
 * Draws the outline of an entity's hitbox for debugging purposes.
 *
 * @param entity The entity to draw the hitbox for.
 */
function drawDebugHitbox(entity) {
    entity.ctx.lineWidth = 6;
    entity.ctx.strokeStyle = 'green';
    entity.ctx.rect(entity.hitbox.x, entity.hitbox.y, entity.hitbox.width, entity.hitbox.height);
}
