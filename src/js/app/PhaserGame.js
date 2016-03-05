define([
    'Phaser',
    'extensions/PowerUp',
    'extensions/Spaceship',
    'extensions/Alien'
], function (Phaser) {
    return function () {
        return new Phaser.Game(980, 720, Phaser.AUTO, 'container');
    };
});