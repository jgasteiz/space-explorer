define([
    'Phaser',
    'modules/Config',
    'modules/Print',
    'modules/Utils',
    'extensions/Character'
], function (Phaser, Config, Print, Utils) {

    /**
     * Alien constructor method.
     * Initialise the sprite and add it to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @constructor
     */
    var Alien = function (game, x, y, sprite) {
        Phaser.Character.call(this, game, x, y, sprite);
        Phaser.Character.prototype.initializeConfig.call(this, Config.getAlienConfig());
    };

    Alien.prototype = Object.create(Phaser.Character.prototype);
    Alien.prototype.constructor = Alien;

    // TODO: add some proper sprites with angles for the Alien so we don't have to do this.
    Alien.prototype.setFrameForRotation = function (rotation) {
        this.rotation = rotation;
    };

    Phaser.Alien = Alien;
});
