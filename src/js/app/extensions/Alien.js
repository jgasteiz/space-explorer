define([
    'Phaser',
    'modules/Utils',
    'extensions/Character'
], function (Phaser, Utils) {

    /**
     * Alien constructor method.
     * Initialise the sprite and add it to the game.
     * @param game
     * @param x
     * @param y
     * @constructor
     */
    var Alien = function (game, x, y) {
        Phaser.Character.call(this, game, x, y, 'alien');
        Phaser.Character.prototype.initializeConfig.call(this, game.cache.getJSON('alien'));

        // Easing for start/end of the movement tween - slower at the beginning and end.
        this.movementEasing = Phaser.Easing.Sinusoidal.InOut;
    };

    Alien.prototype = Object.create(Phaser.Character.prototype);
    Alien.prototype.constructor = Alien;

    // TODO: add some proper sprites with angles for the Alien so we don't have to do this.
    Alien.prototype.setFrameForRotation = function (rotation) {
        this.rotation = rotation;
    };

    Phaser.Alien = Alien;
});
