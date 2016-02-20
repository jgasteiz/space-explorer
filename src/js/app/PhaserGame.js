define(['Phaser', 'extensions/Spaceship'], function (Phaser) {

    var PhaserGame = function (w, h, containerId) {
        return new Phaser.Game(w, h, Phaser.AUTO, containerId);
    };

    return PhaserGame;
});