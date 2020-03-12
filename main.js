let ASSET_MANAGER = new AssetManager();
var font = "VT323";

//! ******** Arrow Definition **********
function Arrow(game, spritesheet) {
    this.x = this.relX = 0;
    this.y = this.relY = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.removeFromWorld = false;
    this.speed = 700;
    this.isRecoiling = false;
    this.hitByEnemy = false;
    this.direction = this.game.player.direction;
    this.isPlayerProjectile = true;

    switch (this.game.player.direction) {
        case "down" :
            this.x = this.relX = 450;
            this.y = this.relY = 325 + 50;
            break;
        case "up" :
            this.x = this.relX = 450;
            this.y = this.relY = 325 - 15;
            break;
        case "left" :
            this.x = this.relX = 450 - 15;
            this.y = this.relY = 325;
            break;
        case "right":
            this.x = this.relX = 450 + 15;
            this.y = this.relY = 325;
            break
    }

    ArrowAnimationInit(this, this.spritesheet);
    this.hitbox = new Hitbox(this.x, this.y, 35, 32, true);
    this.currAnimation = this.animations[this.direction];
}

Arrow.prototype.update = function () {
    switch (this.direction) {
        case "down":
            this.y += this.game.clockTick * this.speed;
            break;

        case "up":
            this.y -= this.game.clockTick * this.speed;
            break;

        case "left":
            this.x -= this.game.clockTick * this.speed;
            break;

        case "right":
            this.x += this.game.clockTick * this.speed;
            break
    }
    updatePlayerHitbox(this);
    checkForCollisions(this);
    updateRecoilFrames(this);
    Entity.prototype.update.call(this);
};


Arrow.prototype.draw = function () {
    if (!this.game.onTitleScreen && !this.game.gameOver && !this.game.levelComplete) {
        this.currAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }
};

ASSET_MANAGER.retrieveAllAssets();
ASSET_MANAGER.downloadAll(function () {
    WebFontConfig = {
        google:{ families: [font] },
    };
    (function(){
        var wf = document.createElement("script");
        wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
        wf.async = 'true';
        document.head.appendChild(wf);
    })();

    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');

    let gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.startInput();
    gameEngine.setPlayer(new SkeletonDagger(gameEngine,
        ASSET_MANAGER.getAsset("./res/character/skeleton_sword.png"), ASSET_MANAGER.getAsset("./res/character/skeletonbow.png")));

    gameEngine.setBackground(titleScreenInit(gameEngine, ASSET_MANAGER));

    let volumeToggle = new VolumeToggle(gameEngine, ASSET_MANAGER.getAsset("./res/audio/volume_bgON.png"));
    gameEngine.setVolumeToggle(volumeToggle);
    gameEngine.addEntity(volumeToggle);
    let healthUI = new SkeletonHealthUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/skeleton_life.png"))
    gameEngine.setHealthUI(healthUI);
    gameEngine.addEntity(healthUI);
    let defUI = new SkeletonDefUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/def_ui.png"));
    gameEngine.setDefUI(defUI);
    gameEngine.addEntity(defUI);
    let atkUI = new SkeletonAtkUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/sword_ui.png"));
    gameEngine.setAtkUI(atkUI);
    gameEngine.addEntity(atkUI);
    let enemyUI = new EnemyUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/enemy_ui.png"));
    gameEngine.setEnemyUI(enemyUI);
    gameEngine.addEntity(enemyUI);
    let timerUI = new TimerUI(gameEngine, ASSET_MANAGER.getAsset("./res/character/timer_ui.png"));
    gameEngine.setTimerUI(timerUI);
    gameEngine.addEntity(timerUI);
    gameEngine.start();
});
