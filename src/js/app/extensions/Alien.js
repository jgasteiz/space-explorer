define([
    'Phaser',
    'utils/Config',
    'extensions/Character'
], function (Phaser, Config) {

    var config = Config.getConfig();

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
        var self = this;

        Phaser.Character.call(self, game, x, y, sprite);

        self.anchor.setTo(.5, .5);
        game.physics.arcade.enable(self);
        self.body.collideWorldBounds = true;

        self.speed = 200;

        game.add.existing(this);
    };

    Alien.prototype = Object.create(Phaser.Character.prototype);
    Alien.prototype.constructor = Alien;

    /**
     * Spawn a number of aliens in the given game.
     * @param game - Phaser.Game instance
     * @param group - Phaser.Group instance
     * @param numAliens
     */
    Alien.spawnAliensInGame = function (game, group, numAliens, onAlienClick) {
        // Spawn `numAliens` number of aliens.
        for (var i = 0; i < numAliens; i++) {
            var randomXY = Phaser.Character.getRandomWorldCoordinates();

            var alien = new Phaser.Alien(game, randomXY.x, randomXY.y, 'alien');
            alien.events.onInputDown.add(onAlienClick.callback, onAlienClick.context);

            // If a group was specified, add the alien to the group.
            if (group) {
                group.add(alien);
            }

            // Move the alien
            alien.moveAround();
        }
    };

    Phaser.Alien = Alien;
});
