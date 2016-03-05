define([
    'Phaser',
    'states/BaseStage',
    'extensions/PowerUp',
    'extensions/Spaceship',
    'extensions/Marine',
    'extensions/Alien'
], function (Phaser) {
    return function () {
        return new Phaser.Game(980, 720, Phaser.AUTO, 'container');
    };
});