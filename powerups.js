function chanceForPowerUp(entity) {
    let randNum = getRndInteger(1,5);
    let tolerance = 5;
    if (randNum <= tolerance) {
        randNum = getRndInteger(1,6);
        switch (randNum) {
            case 1:

                break;
            case 2:
                //def up
                break;
            case 3:
                //hp up
                break;
            case 4:
                //arrows
                break;
            case 5:
                //speedup
                break;
            case 6:
                //poison
                break;
        }
    }
}


function PowerUp(entity, spritesheet, type) {
    this.x = this.spawnX = entity.x;
    this.y = this.spawnY = entity.y;
    this.game = entity.game;
    this.ctx = entity.ctx;
    this.removeFromWorld = false;
    this.type = type;
    this.isRecoiling = false;
    this.spritesheet = spritesheet;
    this.hitbox = new Hitbox(this.x, this.y, 40, 32, true);
}

PowerUp.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

PowerUp.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    //updateHitbox(this, (this.x + this.hitboxOffsetX), (this.y + this.hitboxOffsetY));
    if (this.isRecoiling) {
        switch (this.type) {
            case "atk":
                atk++;
                this.removeFromWorld = true;
                break;
            case "def":
                def++;
                this.removeFromWorld = false;
                break;
            case "hp":
                hp += 10;
                this.removeFromWorld = false;
                break;
            case "speed":
                //insert speed up line here
                this.removeFromWorld = false;
                break;
            case "poison":
                hp += 10;
                this.removeFromWorld = false;
                break;
        }
    }
};

