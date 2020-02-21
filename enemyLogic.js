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
    // console.log(deltaX + ", " + deltaY);
    
}