define([
    'Phaser',
    'modules/Config',
    'extensions/Spaceship',
    'extensions/Alien'
], function (Phaser, Config) {
    return function () {
        var config = Config.getConfig();
        return new Phaser.Game(config.width, config.height, Phaser.AUTO, config.containerId);
    };
});