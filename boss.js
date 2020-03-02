function Boss(game, spritesheet) {

}

function KingKnight(game, spritesheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = this.relativeX = 400;
    this.y = this.relativeY = 400;
    this.removeFromWorld = false;
    this.isAttacking = false;
    this.isRecoiling = false;

    this.hp = 10000;
    this.baseSpeed = 250;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.safeDist = 150;

    this.hitbox = new Hitbox(this.x, this.y, 200, 200, true);
    this.hurtbox = new Hitbox(0, 0, 0, 0, false);

    this.animations = bossAnimationInit(spritesheet);
    this.currAnimation = this.animations['walkLeft'];
}

function bossAnimationInit(spritesheet) {
    let animations = [];

    animations['walkLeft'] = new Animation(spritesheet, 1, 146, 85, 69, 851, 0.05, 10, true, 1, true);
    animations['walkRight'] = new Animation(spritesheet, 1, 146, 85, 69, 851, 0.05, 10, true, 1);

    return animations;
}

function bossUpdatePosition(boss) {
    //Update relative distance between enemy and player for scrolling consistency
    let deltaX, deltaY;
    let oldX = boss.x;
    let oldY = boss.y;

    boss.x = boss.relativeX - playerX;
    boss.y = boss.relativeY - playerY;
    deltaX = oldX - boss.x;
    deltaY = oldY - boss.y;
    boss.relativeX += (deltaX - playerDeltaX) / 2;
    boss.relativeY += (deltaY - playerDeltaY) / 2;

//Update distance again to reflect entity's movement;
    let dx = boss.x - boss.game.player.x;
    let dy = boss.y - boss.game.player.y;
    if (!boss.isRecoiling) {
        if (distance(boss, boss.game.player) > boss.safeDist ) {
            if(dx > 2) {
                boss.x -= (boss.game.clockTick * boss.baseSpeed);
            } else if(dx < 0) {
                boss.x += (boss.game.clockTick * boss.baseSpeed);
            }
            if(dy > 2) {
                boss.y -= boss.game.clockTick * boss.baseSpeed;
            } else if(dy < 0) {
                boss.y += boss.game.clockTick * boss.baseSpeed;
            }
        }
    }
    else {
        boss.x += boss.game.clockTick * boss.xSpeed;
        boss.y += boss.game.clockTick * boss.ySpeed;
    }
}