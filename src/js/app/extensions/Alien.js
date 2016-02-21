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
     */
    Alien.spawnAliensInGame = function (game, group) {
        // Spawn `config.numAliens` number of aliens.
        for (var i = 0; i < config.numAliens; i++) {
            var initialX = i * (config.width - 100) / config.numAliens + 50;
            var alien = new Phaser.Alien(game, initialX + 30, 80, 'alien');
            alien.angle = 180;

            // If a group was specified, add the alien to the group.
            if (group) {
                group.add(alien);
            }

            // Move the alien
            alien.moveToXY(
                Math.floor(Math.random() * config.width - 100) + 100,
                Math.floor(Math.random() * config.height - 100) + 100
            );
        }
    };

    Phaser.Alien = Alien;
});