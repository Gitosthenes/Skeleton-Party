/* Terrain Image Paths */
const rock1Path = "./res/terrain/Rock1.png";
const rock2Path = "./res/terrain/Rock2.png";
const dirtHolePath = "./res/terrain/DirtHole.png";
const ivyColumnPath = "./res/terrain/IvyColumn.png";

function forestMapGen(game, assetManager) {
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
}
