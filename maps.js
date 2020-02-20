/* Terrain Image Paths */
const rock1Path = "./res/terrain/Rock1.png";

function forestMapGen(game, assetManager) {
    for (let i = 0; i < 10; i ++) {
        console.log("Added rock");
        game.addTerrain(new Rock1(game, assetManager.getAsset(rock1Path)));
    }
}
