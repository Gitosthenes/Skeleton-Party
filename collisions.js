/**
 * Creates a new Hitbox object that entities use to determine and handle collision.
 *
 * @param x The X coordinate of the hitbox in the game.
 * @param y The Y coordinate of the hitbox in the game.
 * @param h The height of the hitbox.
 * @param w The width of the hitbox.
 * @constructor
 */
function Hitbox(x, y, h, w, isActive) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.top = y;
    this.bottom = y + h;
    this.left = x;
    this.right = x + w;
    this.isActive = isActive;
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

/**
 * Checks for collisions against all other entities in the game world.
 *
 * @param entity The entity we are checking collisions for.
 */
function checkForCollisions(entity) {    
    let otherEntity;

    if(entity === entity.game.player) {//if entity is player]
        for (let i = 0; i < entity.game.enemies.length; i++) {
            otherEntity = entity.game.enemies[i];
            if (hasCollided(entity, otherEntity) && entity !== otherEntity) {
                handleEnemyCollision(entity, otherEntity);
            } else if (hasHitEnemy(entity, otherEntity) && entity !== otherEntity) {
                handleHitCollision(entity, otherEntity);
            }
        }
    } else {//otherwise entity must be enemy
        otherEntity = entity.game.player;
        if (hasHitEnemy(entity, otherEntity)) {
            handleHitCollision(entity, otherEntity);
        }
    }


    for (let i = 0; i < entity.game.terrain.length; i++) {
        let terrain = entity.game.terrain[i];
        if (hasCollided(entity, terrain) && entity !== terrain) {
            handleTerrainCollision(entity, terrain);
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
    let result = false;
    if (a.hitbox && b.hitbox) {
        result = a.hitbox.x < b.hitbox.x + b.hitbox.width
            && a.hitbox.x + a.hitbox.width > b.hitbox.x
            && a.hitbox.y < b.hitbox.y + b.hitbox.height
            && a.hitbox.y + a.hitbox.height > b.hitbox.y;
    }
    return result;
}

/**
 * Determines whether an entity's active hurtbox has struck an enemy's hitbox
 *
 * @param abuser the entity doing the hitting
 * @param victim the entity doing the dying
 */
function hasHitEnemy(abuser, victim) {
    let result = false;
    if(abuser.hurtbox && victim.hitbox && abuser.hurtbox.isActive) {
        result = abuser.hurtbox.x < victim.hitbox.x + victim.hitbox.width
            && abuser.hurtbox.x + abuser.hurtbox.width > victim.hitbox.x
            && abuser.hurtbox.y < victim.hitbox.y + victim.hitbox.height
            && abuser.hurtbox.y + abuser.hurtbox.height > victim.hitbox.y;
    }
    // if(result) console.log(result);
    return result;
}

/**
 * Returns the side of entity a that has been involved in a collision with entity b.
 * Code taken and refactored from StackOverflow question at this link:
 * https://stackoverflow.com/questions/29861096/detect-which-side-of-a-rectangle-is-colliding-with-another-rectangle
 *
 * @param a The entity we are checking collision for.
 * @param b The entity we are checking collision against.
 * @returns {string}
 */
function directionOfCollision(hitboxA, hitboxB) {
    let dx = (hitboxA.x + hitboxA.width / 2) - (hitboxB.x + hitboxB.width / 2);
    let dy = (hitboxA.y + hitboxA.height / 2) - (hitboxB.y + hitboxB.height / 2);
    let width = (hitboxA.width + hitboxB.width) / 2;
    let height = (hitboxA.height + hitboxB.height) / 2;
    let crossWidth = width * dy;
    let crossHeight = height * dx;
    let collision = 'none';

    if (Math.abs(dx) <= width && Math.abs (dy) <= height) {
        if( crossWidth > crossHeight){
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        }else{
            collision = (crossWidth >- (crossHeight)) ? 'right' : 'top';
        }
    }
    return collision;
}

function handleTerrainCollision(entity, terrain) {
    entity.isRecoiling = true;
    entity.invincibilityFrames = 2;

    switch (directionOfCollision(entity.hitbox, terrain.hitbox)) {
        case 'top':
            entity.ySpeed = -entity.baseSpeed;
            break;
        case 'bottom':
            entity.ySpeed = entity.baseSpeed;
            break;
        case 'left':
            entity.xSpeed = -entity.baseSpeed;
            break;
        case 'right':
            entity.xSpeed = entity.baseSpeed;
            break;
    }
}


/**
 * Handles the logic behind player and enemy collisions by updating entity state and velocity.
 *
 * @param you The entity being collided with.
 * @param them The entity doing the colliding.
 */
function handleEnemyCollision(you, them) {
    you.isRecoiling = true;
    you.invincibilityFrames = 6;
    let dirOfCollision = directionOfCollision(you.hitbox, them.hitbox);

    switch (dirOfCollision) {
        case 'top':
            you.ySpeed = -you.baseSpeed;
            break;
        case 'bottom':
            you.ySpeed = you.baseSpeed;
            break;
        case 'left':
            you.xSpeed = -you.baseSpeed;
            break;
        case 'right':
            you.xSpeed = you.baseSpeed;
            break;
    }

    // TODO: Add damage to the player when we get there.

}

/**
 * Logic for when an entity's active hurtbox makes contact with another entityj
 *
 * @param abuser the murderer
 * @param victim the murderee
 */
function handleHitCollision(abuser, victim) {
    victim.isRecoiling = true;
    victim.invincibilityFrames = 6;

    if(victim === abuser.game.player) {
        let dirOfCollision = directionOfCollision(victim.hitbox, abuser.hurtbox);
        switch (dirOfCollision) {
            case 'top':
                victim.ySpeed = -victim.baseSpeed;
                break;
            case 'bottom':
                victim.ySpeed = victim.baseSpeed;
                break;
            case 'left':
                victim.xSpeed = -victim.baseSpeed;
                break;
            case 'right':
                victim.xSpeed = victim.baseSpeed;
                break;
        }
    }
    

    //TODO damage calculation
}

/**
 * Reduces the number of invincibility frames an entity has left after being hit by an enemy or
 * puts the entity back to a regular state if the amount of frames left is zero.
 *
 * @param entity The entity to update.
 */
function updateInvincibilityFrames(entity) {
    if (entity.invincibilityFrames > 0) {
        entity.invincibilityFrames--;
    } else {
        entity.xSpeed = 0;
        entity.ySpeed = 0;
        entity.isRecoiling = false;
    }
}

/**
 * Draws the outline of an entity's hitbox for debugging purposes.
 *
 * @param entity The entity to draw the hitbox for.
 */
function drawDebugHitbox(entity) {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = entity.isRecoiling ? 'orange' : 'green';
    ctx.lineWidth = 2;
    ctx.rect(entity.hitbox.x, entity.hitbox.y, entity.hitbox.width, entity.hitbox.height);
    ctx.stroke();
    ctx.closePath();
}

function drawDebugHurtbox(entity) {
    if(entity.hurtbox && entity.hurtbox.isActive) {
        let canvas = document.getElementById('gameWorld');
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.rect(entity.hurtbox.x, entity.hurtbox.y, entity.hurtbox.width, entity.hurtbox.height);
        ctx.stroke();
        ctx.closePath();
    }
}

/**
 * Updates an entity's hitbox to match their current location in the game. Should be called
 * after updating an entity's position during their update function.
 *
 * @param entity The entity to have their hitbox adjusted.
 */
function updateHitbox(entity, x , y) {
    if(x && y) {
        entity.hitbox.x = x;
        entity.hitbox.y = y;
    } else {
        entity.hitbox.x = entity.x;
        entity.hitbox.y = entity.y;
    }
}

/**
 * Updates an entity's hitbox values relative to their position on the canvas.
 *
 * @param entity The entity whose hitbox is being updated.
 */
function updatePlayerHitbox(entity) {
    let xOffset = 16;
    let yOffset = 13;
    entity.hitbox.x = entity.x + xOffset;
    entity.hitbox.y = entity.y + yOffset;
    entity.hitbox.top = entity.hitbox.y;
    entity.hitbox.bottom = entity.hitbox.y + entity.hitbox.height;
    entity.hitbox.left = entity.hitbox.x;
    entity.hitbox.right = entity.hitbox.x + entity.hitbox.width;
}

function updateTerrainHitbox(entity, xOffset, yOffset, width, height) {
    entity.hitbox.x = entity.x + xOffset;
    entity.hitbox.y = entity.y + yOffset;
    entity.hitbox.width = width;
    entity.hitbox.height = height;
    entity.hitbox.top = entity.hitbox.y;
    entity.hitbox.bottom = entity.hitbox.y + entity.hitbox.height;
    entity.hitbox.left = entity.hitbox.x;
    entity.hitbox.right = entity.hitbox.x + entity.hitbox.width;
}

/**
 * Activates an entity's hurtbox to be used in collision dettection
 *
 * @param entity the entity whose hurtbox is being activated.
 */
function activateHurtbox(entity) {
    entity.hurtbox.isActive = true;
    switch(entity.constructor) {
        //!--------------------------SkeletonDagger--------------------------------
        case SkeletonDagger:
            switch(entity.direction) {
                case 'down':
                    entity.hurtbox.x = (entity.x - 5);
                    entity.hurtbox.y = (entity.y + 45);
                    entity.hurtbox.height = 38;
                    entity.hurtbox.width = 115;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'up':
                    entity.hurtbox.x = (entity.x - 5);
                    entity.hurtbox.y = entity.y;
                    entity.hurtbox.height = 38;
                    entity.hurtbox.width = 115;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'left':
                    entity.hurtbox.x = entity.x - 52;
                    entity.hurtbox.y = entity.y + 17;
                    entity.hurtbox.height = 38;
                    entity.hurtbox.width = 80;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'right':
                    entity.hurtbox.x = entity.x + 40;
                    entity.hurtbox.y = entity.y + 17;
                    entity.hurtbox.height = 38;
                    entity.hurtbox.width = 80;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
            }
            break;
        //!--------------------------MaleKnightSpear--------------------------------
        case MaleKnightSpear:
            switch(entity.direction) {
                case 'Down':
                    entity.hurtbox.x = (entity.x + entity.hitboxOffsetX + 5);
                    entity.hurtbox.y = (entity.y + entity.hitboxOffsetY + 45);
                    entity.hurtbox.height = 40;
                    entity.hurtbox.width = 20;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'Up':
                    entity.hurtbox.x = (entity.x + entity.hitboxOffsetX + 5);
                    entity.hurtbox.y = (entity.y + entity.hitboxOffsetY - 30);
                    entity.hurtbox.height = 30;
                    entity.hurtbox.width = 20;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'Left':
                    entity.hurtbox.x = entity.x - 22;
                    entity.hurtbox.y = entity.y + 23;
                    entity.hurtbox.height = 30;
                    entity.hurtbox.width = 50;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
                case 'Right':
                    entity.hurtbox.x = entity.x + 40;
                    entity.hurtbox.y = entity.y + 23;
                    entity.hurtbox.height = 30;
                    entity.hurtbox.width = 50;
                    entity.hurtbox.top = entity.hurtbox.y;
                    entity.hurtbox.bottom = entity.hurtbox.y + entity.hurtbox.height;
                    entity.hurtbox.left = entity.hurtbox.x;
                    entity.hurtbox.right = entity.hurtbox.x + entity.hurtbox.width;
                    break;
            }
            break;
    }
}
