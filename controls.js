/**
 * Uses the player inputs to update the player character, including the character speed,
 * direction, animation, and position.
 *
 * @param entity The game entity to be updated from user input.
 */
function handleInput(entity) {
    let spd = entity.baseSpeed;
    let key = entity.game.userInput[0]; // Get the first value in the userInput array.
    if (entity.isRecoiling) {    // If the entity is in a busy state, don't interrupt their animation.
        if (entity.recoilFrames > 0) {
            entity.changeX = entity.changeY = true;
        }
    }
    if (entity.isAttacking) {
        if (entity.currAnimation.elapsedTime === 0) {
            entity.isAttacking = false;
        }
    }

    if (!entity.isAttacking && !entity.isRecoiling && !entity.isDead) {   // If the entity isn't busy, update their state based on input received.
        switch (key) {
            case undefined:    // No input.
                if (entity.direction === 'up') setIdleState(entity,'Up');
                else if (entity.direction === 'down') setIdleState(entity, 'Down');
                else if (entity.direction === 'left') setIdleState(entity, 'Left');
                else if (entity.direction === 'right') setIdleState(entity, 'Right');
                break;

            case 'j':   // Attack input.
                if (entity.direction === 'up') setBattleState(entity, "",'Up');
                else if (entity.direction === 'down') setBattleState(entity, "",'Down');
                else if (entity.direction === 'left') setBattleState(entity, "",'Left');
                else if (entity.direction === 'right') setBattleState(entity, "",'Right');
                break;

            case 'k':
                if(entity.direction === 'up') setBattleState(entity, "Bow","Up");
                else if(entity.direction === 'down') setBattleState(entity, "Bow","Down");
                else if(entity.direction === 'left') setBattleState(entity, "Bow","Left");
                else if(entity.direction === 'right') setBattleState(entity, "Bow","Right");
                break;

            case 'w':   // Up input.
                if (entity.game.userInput.includes('s')) {    // Up - Down case.
                    setIdleState(entity, 'Up');
                } else if (entity.game.userInput.includes('a')) {   // Up - Left case.
                    setDiagonalState(entity, 'Up', -spd, -spd);
                } else if (entity.game.userInput.includes('d')) {   // Up - Right case.
                    setDiagonalState(entity, 'Up', spd, -spd);
                } else if (entity.game.userInput.includes('j')) {     // Up - Attack case.
                    setBattleState(entity, "",'Up');
                } else if (entity.game.userInput.includes("k")) {
                    setBattleState(entity, "Bow", "Up");
                } else {  // Up case.
                    setMovementState(entity, 'Up', 0, -spd);
                }
                break;

            case 's':   // Down input.
                if (entity.game.userInput.includes('w')) {    // Down - Up case.
                    setIdleState(entity, 'Down');
                } else if (entity.game.userInput.includes('a')) {   // Down - Left case.
                    setDiagonalState(entity, 'Down', -spd, spd);
                } else if (entity.game.userInput.includes('d')) {   // Down - Right case.
                    setDiagonalState(entity, 'Down', spd, spd);
                } else if (entity.game.userInput.includes('j')) {     // Down - Attack case.
                    setBattleState(entity, "",'Down');
                } else if (entity.game.userInput.includes("k")) {
                    setBattleState(entity,"Bow","Down");
                }
                else {  // Down case.
                    setMovementState(entity, 'Down', 0, spd);
                }
                break;

            case 'a':   // Left input.
                if (entity.game.userInput.includes('w')) {    // Left - Up case.
                    setDiagonalState(entity, 'Left', -spd, -spd);
                } else if (entity.game.userInput.includes('s')) {   // Left - Down case.
                    setDiagonalState(entity, 'Left', -spd, spd);
                } else if (entity.game.userInput.includes('d')) {   // Left - Right case
                    setIdleState(entity, 'Left');
                } else if (entity.game.userInput.includes('j')) {     // Left - Attack case.
                    setBattleState(entity, "",'Left');
                } else if (entity.game.userInput.includes('k')) {
                    setBattleState(entity, "Bow", "Left");
                } else {  // Left case.
                    setMovementState(entity, 'Left', -spd, 0);
                }
                break;

            case 'd':   // Right input.
                if (entity.game.userInput.includes('w')) {    // Right - Up case.
                    setDiagonalState(entity, 'Right', spd, -spd);
                } else if (entity.game.userInput.includes('s')) {   // Right - Down case.
                    setDiagonalState(entity, 'Right', spd, spd);
                } else if (entity.game.userInput.includes('a')) {   // Right - Left case.
                    setIdleState(entity, 'Right');
                } else if (entity.game.userInput.includes('j')) {     // Right - Attack case.
                    setBattleState(entity, "",'Right');
                } else if (entity.game.userInput.includes("k")) {
                    setBattleState(entity,"Bow", "Right");
                } else {  // Right case.
                    setMovementState(entity, 'Right', spd, 0);
                }
                break;

            case ' ':   // Start game from title screen
                entity.x = 450;
                entity.y = 325;
                break;
        }
    }
}

/**
 * Helper function that updates an entity's directional speed values.
 *
 * @param entity The entity to be updated.
 * @param xVal The speed value for the X axis.
 * @param yVal The speed value for the Y axis.
 */
function updateEntitySpeed(entity, xVal, yVal) {
    entity.xSpeed = xVal;
    entity.ySpeed = yVal;
}

/**
 * Updates the entity into it's battle state by changing it's speed, animation, and busy state.
 *
 * @param entity The entity to set into battle state.
 * @param weapon the weapon to set
 * @param direction The direction to set the entity to.
 */
function setBattleState(entity, weapon, direction) {
    let animationName = 'attack' + weapon + direction;
    console.log("weapon " + weapon);
    console.log("direction" + direction);
    updateEntitySpeed(entity, 0, 0);
    entity.direction = direction.toLowerCase();
    entity.currAnimation = entity.animations[animationName];
    entity.isAttacking = true;
}

/**
 * Updates the entity into it's idle state by changing it's speed and animation.
 *
 * @param entity The entity to set into idle state.
 * @param direction The direction to set the entity to.
 */
function setIdleState(entity, direction) {
    let animationName = 'idle' + direction;
    updateEntitySpeed(entity, 0, 0);
    entity.direction = direction.toLowerCase();
    entity.currAnimation = entity.animations[animationName];
}

/**
 * Updates the entity into it's movement state by changing it's speed and animation.
 *
 * @param entity The entity to set into movement state.
 * @param direction The direction to set the entity to.
 * @param xVal The new value for the horizontal speed.
 * @param yVal The new value for the vertical speed.
 */
function setMovementState(entity, direction, xVal, yVal) {
    let animationName = 'walk' + direction;
    if (xVal !== 0) {
        entity.changeX = true;
    }
    if (yVal !== 0) {
        entity.changeY = true;
    }
    updateEntitySpeed(entity, xVal, yVal);
    entity.direction = direction.toLowerCase();
    entity.currAnimation = entity.animations[animationName];
}

/**
 * Handles a diagonal movement state by an entity by checking for attack and movement inputs and
 * changing the entity's speed and animation appropriately.
 *
 * @param entity The entity to set into a new state.
 * @param direction The direction to set the entity to.
 * @param xSpd The new value for the horizontal speed.
 * @param ySpd The new value for the vertical speed.
 */
function setDiagonalState(entity, direction, xSpd, ySpd) {
    if (entity.game.userInput.includes('j')) {
        setBattleState(entity, '', direction);
    } else if (entity.game.userInput.includes('k')) {
        setBattleState(entity, 'Bow', direction);
    } else {
        setMovementState(entity, direction, xSpd, ySpd);
    }
}
