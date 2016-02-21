define(['Phaser', 'extensions/Character', 'extensions/Spaceship', 'extensions/Alien'], function (Phaser) {

    var PhaserGame = function (w, h, containerId) {
        return new Phaser.Game(w, h, Phaser.AUTO, containerId);
    };

    return PhaserGame;
});