function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
};

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
};

AssetManager.prototype.downloadAll = function (callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var img = new Image();
        var that = this;

        var path = this.downloadQueue[i];
        console.log(path);

        img.addEventListener("load", function () {
            that.successCount++;
            if(that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        img.src = path;
        this.cache[path] = img;
    }
};

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
};

AssetManager.prototype.retrieveAllAssets = function () {
    // Background images
    this.queueDownload("./res/map/titlescreen.jpg");
    this.queueDownload("./res/map/LevelComplete.png");
    this.queueDownload("./res/map/forest.png");
    this.queueDownload("./res/map/desert.png");
    this.queueDownload("./res/map/graveyard.png");
    // Character sprites
    this.queueDownload("./res/character/skeleton_sword.png");
    this.queueDownload("./res/character/skeletonbow.png");
    this.queueDownload("./res/character/male_knight_spear.png");
    this.queueDownload("./res/character/male_knight_mace.png");
    this.queueDownload("./res/character/skeleton_life.png");
    this.queueDownload("./res/character/DesertWarriorWarAxe.png");
    this.queueDownload("./res/character/DesertWarriorDagger.png");
    this.queueDownload("./res/character/ZombieShovel.png");
    //FX spritesheet
    this.queueDownload("./res/fx/weapon.png");
    //Projectile assets
    this.queueDownload("./res/character/Arrow.png");
    //PowerUp Assets
    this.queueDownload("./res/icon/placeholder.jpg");
    this.queueDownload("./res/icon/heart.png");
    this.queueDownload("./res/icon/poison_heart.png");
    this.queueDownload("./res/icon/boots.png");
    this.queueDownload("./res/icon/.png");
    // UI Assets
    this.queueDownload("./res/character/def_ui.png");
    this.queueDownload("./res/character/sword_ui.png");
    this.queueDownload("./res/character/enemy_ui.png");
    this.queueDownload("./res/character/timer_ui.png");
    // Audio assets
    this.queueDownload("./res/audio/megalovania.mp3");
    this.queueDownload("./res/audio/volume_bgON.png");
    this.queueDownload("./res/audio/volume_bgOFF.png");
    // Terrain assets.
    // Forest terrain
    this.queueDownload("./res/terrain/Rock1.png");
    this.queueDownload("./res/terrain/Rock2.png");
    this.queueDownload("./res/terrain/DirtHole.png");
    this.queueDownload("./res/terrain/IvyColumn.png");
    this.queueDownload("./res/terrain/ConiferousTree.png");
    // Desert Terrain
    this.queueDownload("./res/terrain/BigCactus.png");
    this.queueDownload("./res/terrain/DesertRiver.png");
    this.queueDownload("./res/terrain/DesertRockLarge.png");
    this.queueDownload("./res/terrain/DesertRockSmall.png");
    this.queueDownload("./res/terrain/DesertSpikesDark.png");
    this.queueDownload("./res/terrain/DesertSpikesLight.png");
    this.queueDownload("./res/terrain/DesertRubble.png");
    // Graveyard Terrain
    this.queueDownload(crossPath);
    this.queueDownload(headstonePath);
    this.queueDownload(horizontalHedgePath);
    this.queueDownload(verticalHedgePath);
};

AssetManager.prototype.downloadAndAttach = function () {

};
