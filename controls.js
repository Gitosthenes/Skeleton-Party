/**
 * Uses the player inputs to update the player character, including the character speed,
 * direction, animation, and position.
 *
 * @param entity The game entity to be updated from user input.
 * @returns {boolean[]} A boolean array containing values for whether or not the X or Y positions have been changed.
 */
function handleInput(entity) {
    let changeX = false;
    let changeY = false;
    let key = entity.game.userInput[0];

    if (entity.isBusy) {
        if (entity.currAnimation.elapsedTime === 0) {
            entity.isBusy = false;
        }
    }

    if (!entity.isBusy) {
        switch (key) {
            case undefined:    // No input.
                updateEntitySpeed(entity, 0, 0);
                if (entity.direction === 'up') entity.currAnimation = entity.animations['idleUp'];
                else if (entity.direction === 'down') entity.currAnimation = entity.animations['idleDown'];
                else if (entity.direction === 'left') entity.currAnimation = entity.animations['idleLeft'];
                else if (entity.direction === 'right') entity.currAnimation = entity.animations['idleRight'];
                break;

            case 'j':   // Attack input.
                entity.isBusy = true;
                if (entity.direction === 'up') entity.currAnimation = entity.animations['attackUp'];
                else if (entity.direction === 'down') entity.currAnimation = entity.animations['attackDown'];
                else if (entity.direction === 'left') entity.currAnimation = entity.animations['attackLeft'];
                else if (entity.direction === 'right') entity.currAnimation = entity.animations['attackRight'];
                break;

            case 'w':   // Up input.
                entity.direction = 'up';
                if (entity.game.userInput.includes('s')) {    // Up - Down case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['idleUp'];
                } else if (entity.game.userInput.includes('a')) {   // Up - Left case.
                    updateEntitySpeed(entity, -entity.baseSpeed, -entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkUp'];
                } else if (entity.game.userInput.includes('d')) {   // Up - Right case.
                    updateEntitySpeed(entity, entity.baseSpeed, -entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkUp'];
                } else if (entity.game.userInput.includes('j')) {     // Up - Attack case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['attackUp'];
                    entity.isBusy = true;
                } else {  // Up case.
                    updateEntitySpeed(entity, 0, -entity.baseSpeed);
                    changeY = true;
                    entity.currAnimation = entity.animations['walkUp'];
                }
                break;

            case 's':   // Down input.
                entity.direction = 'down';
                if (entity.game.userInput.includes('w')) {    // Down - Up case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['idleDown'];
                } else if (entity.game.userInput.includes('a')) {   // Down - Left case.
                    updateEntitySpeed(entity, -entity.baseSpeed, entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkDown'];
                } else if (entity.game.userInput.includes('d')) {   // Down - Right case.
                    updateEntitySpeed(entity, entity.baseSpeed, entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkDown'];
                } else if (entity.game.userInput.includes('j')) {     // Down - Attack case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['attackDown'];
                    entity.isBusy = true;
                }
                else {  // Down case.
                    updateEntitySpeed(entity, 0, entity.baseSpeed);
                    changeY = true;
                    entity.currAnimation = entity.animations['walkDown'];
                }
                break;

            case 'a':   // Left input.
                entity.direction = 'left';
                if (entity.game.userInput.includes('w')) {    // Left - Up case.
                    updateEntitySpeed(entity, -entity.baseSpeed, -entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkLeft'];
                } else if (entity.game.userInput.includes('s')) {   // Left - Down case.
                    updateEntitySpeed(entity, -entity.baseSpeed, entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkLeft'];
                } else if (entity.game.userInput.includes('d')) {   // Left - Right case
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['idleLeft'];
                } else if (entity.game.userInput.includes('j')) {     // Left - Attack case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['attackLeft'];
                    entity.isBusy = true;
                }
                else {  // Left case.
                    updateEntitySpeed(entity, -entity.baseSpeed, 0);
                    changeX = true;
                    entity.currAnimation = entity.animations['walkLeft'];
                }
                break;

            case 'd':   // Right input.
                entity.direction = 'right';
                if (entity.game.userInput.includes('w')) {    // Right - Up case.
                    updateEntitySpeed(entity, entity.baseSpeed, -entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkRight'];
                } else if (entity.game.userInput.includes('s')) {   // Right - Down case.
                    updateEntitySpeed(entity, entity.baseSpeed, entity.baseSpeed);
                    changeX = changeY = true;
                    entity.currAnimation = entity.animations['walkRight'];
                } else if (entity.game.userInput.includes('a')) {   // Right - Left case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['idleRight'];
                } else if (entity.game.userInput.includes('j')) {     // Right - Attack case.
                    updateEntitySpeed(entity, 0, 0);
                    entity.currAnimation = entity.animations['attackRight'];
                    entity.isBusy = true;
                } else {  // Right case.
                    updateEntitySpeed(entity, entity.baseSpeed, 0);
                    changeX = true;
                    entity.currAnimation = entity.animations['walkRight'];
                }
                break;

            case ' ':   // Debug input.
                if (entity.titleScreenComp) {
                    entity.x = 50;
                }
                break;
        }
    }
    return [changeX, changeY];
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
