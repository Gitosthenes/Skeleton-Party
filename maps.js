/* Enemy Image Paths */
const spearGuyPath = "./res/character/male_knight_spear.png";
const maceGuyPath = "./res/character/male_knight_mace.png";

/* Terrain Image Paths */
const rock1Path = "./res/terrain/Rock1.png";
const rock2Path = "./res/terrain/Rock2.png";
const dirtHolePath = "./res/terrain/DirtHole.png";
const ivyColumnPath = "./res/terrain/IvyColumn.png";
const coniferousTreePath = "./res/terrain/ConiferousTree.png";

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
    for (let i = 0; i < 8; i++) {
        game.addEnemy(new MaleKnightSpear(game, assetManager.getAsset(spearGuyPath)));
    }
    for (let i = 0; i < 6; i++) {
        game.addEnemy(new MaleKnightMace(game, assetManager.getAsset(maceGuyPath)));
    }

}

function desertMapGenTerrain(game, assertManager) {
    for (let i = 0; i < 10; i++) {

    }
}

