define([
    'Phaser',
    'utils/Config',
    'extensions/Spaceship',
    'extensions/Alien'
], function (Phaser, Config) {

    var PhaserGame = function () {
        var config = Config.getConfig();
        return new Phaser.Game(config.width, config.height, Phaser.AUTO, config.containerId);
    };

    return PhaserGame;
});