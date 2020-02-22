function distance(a, b) {
    if(a.x && a.y && b.x && b.y) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
    }
}

function updateEnemyPositionAndAnimation(enemy) {
    //Update relative distance between enemy and player for scrolling consistency
    let deltaX, deltaY;
    let oldX = enemy.x;
    let oldY = enemy.y;

    enemy.x = enemy.relativeX - playerX;
    enemy.y = enemy.relativeY - playerY;
    deltaX = oldX - enemy.x;
    deltaY = oldY - enemy.y;
    enemy.relativeX += deltaX / 2;
    enemy.relativeY += deltaY / 2;

//Update distance again to reflect entity's movement;
    if(distance(enemy, enemy.game.player) > enemy.safeDist ) {
        let dx = enemy.x - enemy.game.player.x;
        let dy = enemy.y - enemy.game.player.y;
        if(dx > 2) {
            enemy.x -= (enemy.game.clockTick * enemy.speed);
        } else if(dx < 0) {
            enemy.x += (enemy.game.clockTick * enemy.speed);
        }
        if(dy > 2) {
            enemy.y -= enemy.game.clockTick * enemy.speed;
        } else if(dy < 0) {
            enemy.y += enemy.game.clockTick* enemy.speed;
        }
    }

    updateEnemyAnimation(enemy, deltaX, deltaY);
}

function updateEnemyAnimation(enemy, deltaX, deltaY) {
    let action, direction;
    let deltaVariance = 0.25 ;

    if(!enemy.isAttacking || enemy.currAnimation.elapsedTime == 0) {
        if(distance(enemy.game.player, enemy) > enemy.safeDist) {//should the enemy be walking towards the player?
            action = 'walk';
            enemy.isAttacking = false;
            if((deltaX > -deltaVariance && deltaX < deltaVariance) && deltaY < 0) {//is enemy moving straight up?
                direction = 'Up';
            } else if((deltaX > -deltaVariance && deltaX < deltaVariance) && deltaY > 0) {//is enemy moving straight down?
                direction = 'Down';
            } else if((deltaY > -deltaVariance && deltaY < deltaVariance) && deltaX < 0) {//is the enemy moving straight left?
                direction = 'Left';
            } else if((deltaY > -deltaVariance && deltaY < deltaVariance) && deltaX > 0) {// is the enemy moving straight right?
                direction = 'Right';
            }
        } else {//else enemy should be attaking the player
            action = 'attack';
            direction = enemy.direction;
            enemy.isAttacking = true;
        }
    
        if(action && direction) {
            enemy.direction = direction;
            enemy.state = action+direction;
            enemy.currAnimation = enemy.animations[action+direction];
        }
    }
}

function setEnemyRandomLocation(entity, width) {
    let padding = 80;
    entity.x = entity.relativeX = Math.floor(Math.random() * (((800 * 2.5) - entity.currAnimation.frameWidth - padding) - padding + 1)) + padding;
    entity.y = entity.relativeY = Math.floor(Math.random() * (((800 * 2.5) - entity.currAnimation.frameWidth - padding) - padding + 1)) + padding;
}