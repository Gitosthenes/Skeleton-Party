/* Map Image Paths */
const titleScreenPath = "./res/map/titlescreen.jpg";
const forestMapPath = "./res/map/forest.png";
const desertMapPath = "./res/map/desert.png";

/* Enemy Image Paths */
const spearGuyPath = "./res/character/male_knight_spear.png";
const maceGuyPath = "./res/character/male_knight_mace.png";

/* Terrain Image Paths */
const rock1Path = "./res/terrain/Rock1.png";
const rock2Path = "./res/terrain/Rock2.png";
const dirtHolePath = "./res/terrain/DirtHole.png";
const ivyColumnPath = "./res/terrain/IvyColumn.png";
const coniferousTreePath = "./res/terrain/ConiferousTree.png";

function Map(game, spritesheet, width, height, scale, imagePath, nextMapPath) {
    this.x = bgX;
    this.y = bgY;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.imagePath = imagePath;
    this.nextMapPath = nextMapPath;
    this.playerHasWon = false;
}

Map.prototype.draw = function () {
    if(ON_TITLESCREEN) this.ctx.drawImage(this.spritesheet, this.x, this.y);
    else {
        this.ctx.drawImage(this.spritesheet, this.x, this.y, 800 * 2.5, 800 * 2.5);
    }
    if(time <= 0 || hp <= 0) {
        if (this.game.player.currAnimation.isDone()) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.font = "25px " + font;
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("<GAME OVER>", 425, 350);
            this.ctx.fillText("Refresh to start again!", 370, 450);
            GAME_OVER = true;
        }
    }
    if(enemyCount === 0) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("<YOU WIN>", 425, 350);
        this.ctx.fillText("Refresh to start again!", 370, 450);
        GAME_OVER = true;
    }
};

Map.prototype.update = function () {
    if (this.game.userInput.includes(' ')) {
        if(ON_TITLESCREEN) {
            this.game.setBackground(forestMapInit(this.game, ASSET_MANAGER));
            document.getElementById('audio').play();
            document.getElementById('audio').volume = 0.5;
            ON_TITLESCREEN = false;
        }
    }

    //this is the scrolling
    //background coordinates for debug
    if(!ON_TITLESCREEN) {
        // Bounds checking for the x axis.
        if (bgX - playerX > 438) {
            this.x = 438;
            boundHitLeft = true;
        } else if (bgX - playerX < -1476) {
            this.x = -1476;
            boundHitRight = true;
        } else {
            boundHitLeft = false;
            boundHitRight = false;
            this.x = bgX - playerX;
        }
        // Bounds checking for the y axis.
        if (bgY - playerY > 303) {
            this.y = 303;
            boundHitUp = true;
        } else if (bgY - playerY < -1550) {
            this.y = -1550;
            boundHitDown = true;
        } else {
            boundHitUp = false;
            boundHitDown = false;
            this.y = bgY - playerY;
        }
    }
};

function titleScreenInit(game, assetManager) {
    game.enemies.push(new PlaceHolderEnemy(game, undefined));
    return new Map(game, assetManager.getAsset(titleScreenPath), 800, 800, 1, titleScreenPath, forestMapPath);
}

function forestMapInit(game, assetManager) {
    game.enemies = [];
    game.terrain = [];
    let forest = new Map(game, assetManager.getAsset(forestMapPath), 800, 800, 2.5, forestMapPath, desertMapPath);
    forestMapGenTerrain(game, assetManager);
    forestMapGenEnemy(game, assetManager);
    return forest;
}

function forestMapGenTerrain(game, assetManager) {
    for (let i = 0; i < 8; i ++) {
        game.addTerrain(new Rock1(game, assetManager.getAsset(rock1Path)));
    }
    for (let i = 0; i < 6; i++) {
        game.addTerrain(new Rock2(game, assetManager.getAsset(rock2Path)));
    }
    for (let i = 0; i < 6; i++) {
        game.addTerrain(new DirtHole(game, assetManager.getAsset(dirtHolePath)));
    }
    for (let i = 0; i < 9; i++) {
        game.addTerrain(new IvyColumn(game, assetManager.getAsset(ivyColumnPath)));
    }
    for (let i = 0; i < 6; i++) {
        game.addTerrain(new ConiferousTree(game, assetManager.getAsset(coniferousTreePath)));
    }
}


function forestMapGenEnemy(game, assetManager) {
    game.enemies = [];
    for (let i = 0; i < 8; i++) {
        game.addEnemy(new MaleKnightSpear(game, assetManager.getAsset(spearGuyPath)));
    }
    for (let i = 0; i < 6; i++) {
        game.addEnemy(new MaleKnightMace(game, assetManager.getAsset(maceGuyPath)));
    }

}

function desertMapGenTerrain(game, assetManager) {
    for (let i = 0; i < 10; i++) {

    }
}

