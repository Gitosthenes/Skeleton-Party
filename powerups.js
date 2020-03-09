function chanceForPowerUp(entity) {
    let randNum = getRndInteger(1,5);
    let tolerance = 5;
    if (randNum) {
        randNum = getRndInteger(1,5);
        switch (randNum) {
            case 1:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/character/sword_ui.png"), 'atk'));
                break;
            case 2:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/character/def_ui.png"), "def"));
                break;
            case 3:
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/heart.png"), "hp"));
                break;
            case 4:
                //speedup
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/boots.png"), "speed"));
                break;
            case 5:
                //poison
                entity.game.addPowerUp(new PowerUp(entity, ASSET_MANAGER.getAsset("./res/icon/poison_heart.png"),  "poison"));
                break;
        }
    }
}


function PowerUp(entity, spritesheet, type) {
    this.x = this.spawnX = entity.relativeX + 5;
    this.y = this.spawnY = entity.relativeY + 8;
    this.game = entity.game;
    this.ctx = entity.ctx;
    this.removeFromWorld = false;
    this.type = type;
    this.isRecoiling = false;
    this.spritesheet = spritesheet;
    this.width = 20;
    this.height = 20;
    this.hitbox = new Hitbox(this.x + 2, this.y + 2, 30, 30, true);
}

PowerUp.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 32, 32);
        Entity.prototype.draw.call(this);
    }
};

PowerUp.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateHitbox(this, this.x, this.y);
};

PowerUp.prototype.applyPowerUp = function () {
    console.log('applying powerup...');
    console.log(this.type);
    console.log(this);
    switch (this.type) {
        case "atk":
            console.log('applying attack up');
            atk++;
            break;
        case "def":
            console.log('applying defence up');
            def++;
            break;
        case "hp":
            console.log('applying hp up');
            if (hp + 25 > 100) hp = 100;
            else hp += 25;
            break;
        case "speed":
            console.log('applying speed up');
            //insert speed up line here
            break;
        case "poison":
            console.log('applying poison');
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
    this.hitbox = new Hitbox(this.x, this.y, 32, 32, true);
}

TimePickup.prototype.update = function () {
    this.x = this.spawnX - playerX;
    this.y = this.spawnY - playerY;
    updateHitbox(this, this.x, this.y);
};

TimePickup.prototype.draw = function () {
    if(!this.game.onTitleScreen && !this.game.gameOver) {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 32, 32);
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

