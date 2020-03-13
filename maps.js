/* Map Image Paths */
const titleScreenPath = "./res/map/Titlescreen.png";
const instructionScreenPath = "./res/map/Instructions.png";
const levelCompletePath = "./res/map/LevelComplete.png";
const forestMapPath = "./res/map/forest.png";
const desertMapPath = "./res/map/desert.png";
const graveyardMapPath = "./res/map/graveyard.png";

const caveMapPath = "./res/map/cave.png";

/* Enemy Image Paths */
const spearGuyPath = "./res/character/male_knight_spear.png";
const maceGuyPath = "./res/character/male_knight_mace.png";
const desertWarriorDaggerPath = "./res/character/DesertWarriorDagger.png";
const desertWarriorWarAxePath = "./res/character/DesertWarriorWarAxe.png";
const zombieShovelPath = "./res/character/ZombieShovel.png";

/* FX Image Paths */
const fxPath = "./res/fx/weapon.png";

/* Terrain Image Paths */
// Forest terrain.
const rock1Path = "./res/terrain/Rock1.png";
const rock2Path = "./res/terrain/Rock2.png";
const dirtHolePath = "./res/terrain/DirtHole.png";
const ivyColumnPath = "./res/terrain/IvyColumn.png";
const coniferousTreePath = "./res/terrain/ConiferousTree.png";
// Desert terrain.
const desertRockSmallPath = "./res/terrain/DesertRockSmall.png";
const desertRockLargePath = "./res/terrain/DesertRockLarge.png";
const desertRubblePath = "./res/terrain/DesertRubble.png";
const desertSpikesDarkPath = "./res/terrain/DesertSpikesDark.png";
const desertSpikesLightPath = "./res/terrain/DesertSpikesLight.png";
const bigCactusPath = "./res/terrain/BigCactus.png";
// Graveyard terrain.
const crossPath = "./res/terrain/Cross.png";
const headstonePath = "./res/terrain/Headstone.png";
const horizontalHedgePath = "./res/terrain/HorizontalHedge.png";
const verticalHedgePath = "./res/terrain/VerticalHedge.png";
// Castle terrain.

// Cave terrain.
const caveRockPath = "./res/terrain/caveRock.png";
const caveSpikesPath = "./res/terrain/caveSpikes.png";
const horizontalLavaHolePath = "./res/terrain/horizontalLavaHole.png";
const lavaHolePath = "./res/terrain/lavaHole.png";
const smallLavaHolePath = "./res/terrain/smallLavaHole.png";
const tinyLavaHolePath = "./res/terrain/tinyLavaHole.png";
const verticalLavaHolePath = "./res/terrain/verticalLavaHole.png";



function Map(game, spritesheet, width, height, enemyGenFunction) {
    this.x = bgX;
    this.y = bgY;
    this.width = width;
    this.height = height;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.generateEnemy = enemyGenFunction;
}

Map.prototype.draw = function () {
    if(this.game.onTitleScreen) this.ctx.drawImage(this.spritesheet, this.x, this.y);
    else {
        if (this.game.levelComplete) {
            this.spritesheet = ASSET_MANAGER.getAsset(levelCompletePath);
            this.ctx.drawImage(this.spritesheet, 0, 0, 950, 700);
        } else {
            this.ctx.drawImage(this.spritesheet, this.x, this.y, 800 * 2.5, 800 * 2.5);
        }
    }
    if (time <= 0) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("<You ran out of time!>", 372, 350);
        this.ctx.fillText("Press space to start again!", 350, 450);
        this.game.gameOver = true;
    }
    if (hp <= 0 && this.game.player.isDead) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "25px " + font;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("<You died!>", 425, 350);
        this.ctx.fillText("Press space to start again!", 350, 450);
        this.game.gameOver = true;
    }
};

Map.prototype.update = function () {
    //this is the scrolling
    //background coordinates for debug
    if (!this.game.onTitleScreen) {
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

function mapSetUp(game, assetManager, mapName) {
    let map = undefined;
    let mapDimension = 800 * 2.5;
    let i;
    game.levelComplete = false;
    switch (mapName) {
        case 'title':
            game.enemies.push(new PlaceHolderEnemy(game, undefined));
            map = new Map(game, assetManager.getAsset(titleScreenPath), 950, 700);
            break;
        case 'instructions':
            game.userInput = [];
            game.enemies.push(new PlaceHolderEnemy(game, undefined));
            map = new Map(game, assetManager.getAsset(instructionScreenPath), 950, 700);
            break;
        case 'forest':
            game.clearEntities();
            game.resetPlayerPosition();
            forestMapGenTerrain(game, assetManager);
            map = new Map(game, assetManager.getAsset(forestMapPath), mapDimension, mapDimension, forestGenerateEnemy);
            game.enemyCount = 30;
            game.spawnMax = 12;
            for (i = 0; i < game.enemyCount; i++) {
                forestGenerateEnemy(game, ASSET_MANAGER);
            }
            game.setEnemyHealth();
            break;
        case 'desert':
            game.clearEntities();
            game.resetPlayerPosition();
            desertMapGenerateTerrain(game, assetManager);
            map = new Map(game, assetManager.getAsset(desertMapPath), mapDimension, mapDimension, desertGenerateEnemy);
            game.enemyCount = 45;
            game.spawnMax = 16;
            for (i = 0; i < game.enemyCount; i++) {
                desertGenerateEnemy(game, ASSET_MANAGER);
            }
            game.setEnemyHealth();
            break;
        case 'graveyard':
            game.clearEntities();
            game.resetPlayerPosition();
            graveyardMapGenerateTerrain(game, assetManager);
            map = new Map(game, assetManager.getAsset(graveyardMapPath), mapDimension, mapDimension, graveyardGenerateEnemy);
            game.enemyCount = 50;
            game.spawnMax = 22;
            for (i = 0; i < game.enemyCount; i++) {
                graveyardGenerateEnemy(game, ASSET_MANAGER);
            }
            game.setEnemyHealth();
            break;
        case 'cave':
            game.clearEntities();
            game.resetPlayerPosition();
            caveMapGenerateTerrain(game, ASSET_MANAGER);
            map = new Map(game, assetManager.getAsset(caveMapPath), mapDimension, mapDimension, caveGenerateEnemy);
            game.enemyCount = 75;
            game.spawnMax = 28;
            for (i = 0; i < game.enemyCount; i++) {
                caveGenerateEnemy(game, ASSET_MANAGER);
            }
            game.setEnemyHealth();
            break;
    }
    return map;
}

function titleScreenInit(game, assetManager) {
    game.enemies.push(new PlaceHolderEnemy(game, undefined, undefined));
    return new Map(game, assetManager.getAsset(titleScreenPath), 800, 800, 1, titleScreenPath, forestMapPath);
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

function forestGenerateEnemy(game, assetManager) {
    let enemy = undefined;
    switch (Math.floor(Math.random() * 2)) {
        case 0:
            enemy = new MaleKnightSpear(game, assetManager.getAsset(spearGuyPath), assetManager.getAsset(fxPath));
            break;
        case 1:
            enemy = new MaleKnightMace(game, assetManager.getAsset(maceGuyPath), assetManager.getAsset(fxPath));
            break;
    }
    game.addEnemy(enemy);
}

function desertMapGenerateTerrain(game, assetManager) {
    for (let i = 0; i < 12; i++) {
        game.addTerrain(new DesertRockSmall(game, assetManager.getAsset(desertRockSmallPath)));
    }
    for (let i = 0; i < 10; i++) {
        game.addTerrain(new DesertRockLarge(game, assetManager.getAsset(desertRockLargePath)));
    }
    for (let i = 0; i < 18; i++) {
        game.addTerrain(new DesertSpikesDark(game, assetManager.getAsset(desertSpikesDarkPath)))
    }
    for (let i = 0; i < 14; i++) {
        game.addTerrain(new DesertSpikesLight(game, assetManager.getAsset(desertSpikesLightPath)))
    }
    for (let i = 0; i < 13; i++) {
        game.addTerrain(new BigCactus(game, assetManager.getAsset(bigCactusPath)));
    }
    for (let i = 0; i < 8; i++) {
        game.addTerrain(new DesertRubble(game, assetManager.getAsset(desertRubblePath)));
    }
}

function desertGenerateEnemy(game, assetManager) {
    let enemy = undefined;
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            enemy = new DesertWarriorWarAxe(game, assetManager.getAsset(desertWarriorWarAxePath), assetManager.getAsset(fxPath));
            break;
        case 1:
            enemy = new DesertWarriorDagger(game, assetManager.getAsset(desertWarriorDaggerPath), assetManager.getAsset(fxPath));
            break;
        case 2:
            enemy = new ZombieShovel(game, assetManager.getAsset(zombieShovelPath), assetManager.getAsset(fxPath));
            break;

    }
    game.addEnemy(enemy);
}

function graveyardMapGenerateTerrain(game, assetManager) {
    for (let i = 0; i < 8; i ++) {
        game.addTerrain(new Rock1(game, assetManager.getAsset(rock1Path)));
    }
    for (let i = 0; i < 6; i++) {
        game.addTerrain(new Rock2(game, assetManager.getAsset(rock2Path)));
    }
    for (let i = 0; i < 10; i++) {
        game.addTerrain(new ConiferousTree(game, assetManager.getAsset(coniferousTreePath)));
    }
    for (let i = 0; i < 18; i++) {
        game.addTerrain(new Cross(game, assetManager.getAsset(crossPath)));
    }
    for (let i = 0; i < 8; i++) {
        game.addTerrain(new Headstone(game, assetManager.getAsset(headstonePath)));
    }
    for (let i = 0; i < 7; i++) {
        game.addTerrain(new VerticalHedge(game, assetManager.getAsset(verticalHedgePath)));
    }
    for (let i = 0; i < 6; i++) {
        game.addTerrain(new HorizontalHedge(game, assetManager.getAsset(horizontalHedgePath)));
    }
}

function graveyardGenerateEnemy(game, assetManager) {
    let enemy = undefined;
    switch (Math.floor(Math.random() * 0)) {
        case 0:
            enemy = new ZombieShovel(game, assetManager.getAsset(zombieShovelPath), assetManager.getAsset(fxPath));
            break;

    }
    game.addEnemy(enemy);
}

function caveMapGenerateTerrain(game, assetManager) {
    let i;
    for (i = 0; i < 5; i++) {
        game.addTerrain(new CaveRock(game, assetManager.getAsset(caveRockPath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new CaveSpikes(game, assetManager.getAsset(caveSpikesPath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new HorizontalLavaHole(game, assetManager.getAsset(horizontalLavaHolePath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new LavaHole(game, assetManager.getAsset(lavaHolePath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new SmallLavaHole(game, assetManager.getAsset(smallLavaHolePath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new TinyLavaHole(game, assetManager.getAsset(tinyLavaHolePath)));
    }
    for (i = 0; i < 5; i++) {
        game.addTerrain(new VerticalLavaHole(game, assetManager.getAsset(verticalLavaHolePath)));
    }
}

function caveGenerateEnemy(game, assetManager) {
    let enemy = undefined;
    // TODO: Add cave specific enemies and generate them here.
    switch (Math.floor(Math.random() * 2)) {
        case 0:
            enemy = new MaleKnightSpear(game, assetManager.getAsset(spearGuyPath), assetManager.getAsset(fxPath));
            break;
        case 1:
            enemy = new MaleKnightMace(game, assetManager.getAsset(maceGuyPath), assetManager.getAsset(fxPath));
            break;
    }
    game.addEnemy(enemy);
}

