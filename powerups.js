function chanceForPowerUp(entity) {
    let randNum = getRndInteger(1,5);
    let tolerance = 5;
    if (randNum) {
        randNum = getRndInteger(1,5);
        switch (randNum) {
            case 1:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/placeholder.jpg")), "atk");
                break;
            case 2:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/placeholder.jpg")), "def");
                break;
            case 3:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/placeholder.jpg")), "hp");
                break;
            case 4:
                //speedup
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/placeholder.jpg")), "speed");
                break;
            case 5:
                //poison
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/placeholder.jpg")), "poison");
                break;
        }
    }
}


function PowerUp(entity, spritesheet, type) {
    this.x = this.spawnX = entity.relativeX;
    this.y = this.spawnY = entity.relativeY;
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
    updateHitbox(this, this.x, this.y);
};

PowerUp.prototype.applyPowerUp = function () {
    switch (this.type) {
        case "atk":
            atk++;
            break;
        case "def":
            def++;
            break;
        case "hp":
            hp += 25;
            break;
        case "speed":
            //insert speed up line here
            break;
        case "poison":
            hp -= 25;
            break;
    }
};

function TimePickup(game, spritesheet) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 32;
    setRandomLocation(this, 800 * 2.5, 800 * 2.5);
    this.spawnX = this.x;
    this.spawnY = this.y;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.type = 'time';
    this.isRecoiling = false;
    this.spritesheet = spritesheet;
    this.hitbox = new Hitbox(this.x, this.y, this.height, this.width, true);
    console.log('x: ' + this.x + ' y: ' + this.y);
}

TimePickup.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateHitbox(this, this.x, this.y);
};

TimePickup.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

TimePickup.prototype.applyPowerUp = function () {
    time += 15;
    this.game.timerSpawns--;
};

function chanceSpawnTimer(game) {
    let chance = Math.floor((Math.random() * 100000) + 1);
    if (chance > 90000) {
        console.log('Spawned a timer on the map.');
        game.addPowerUp(new TimePickup(game, ASSET_MANAGER.getAsset("./res/character/timer_ui.png")));
        game.timerSpawns++;
    }
}

