define(['Phaser', 'Config'], function (Phaser, Config) {

    var config = Config.getConfig();

    /**
     * Alien constructor method.
     * Initialise the sprite, the animations and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @param explosions
     * @constructor
     */
    var Alien = function (game, x, y, sprite, explosions) {
        var self = this;

        Phaser.Sprite.call(self, game, x, y, sprite);

        self.explosions = explosions;
        self.animations.add('explosion');
        self.anchor.setTo(.5, .5);
        game.physics.arcade.enable(self);
        self.body.collideWorldBounds = true;

        game.add.existing(this);
    };

    Alien.prototype = Object.create(Phaser.Sprite.prototype);
    Alien.prototype.constructor = Alien;

    /**
     * Create an explosion animation and kill the sprite.
     */
    Alien.prototype.destroy = function () {
        var self = this;

        var explosion = self.explosions.getFirstExists(false);
        explosion.reset(self.body.x - self.body.width / 2, self.body.y);
        explosion.play('explosion', 30, false, true);

        self.kill();
    };

    /**
     * Spawn a number of aliens in the given game.
     * @param game - Phaser.Game instance
     * @param group - Phaser.Group instance
     * @param explosions - Phaser.Group instance
     */
    Alien.spawnAliensInGame = function (game, group, explosions) {
        explosions.createMultiple(config.numAliens, 'explosion');
        explosions.forEach(function (explosion) {
            explosion.anchor.x = 0;
            explosion.anchor.y = 0;
            explosion.animations.add('explosion');
        }, this);

        // Spawn `config.numAliens` number of aliens.
        for (var i = 0; i < config.numAliens; i++) {
            var initialX = i * (config.width - 100) / config.numAliens + 50;
            var alien = new Phaser.Alien(game, initialX + 30, 80, 'alien', explosions);

            // If a group was specified, add the alien to the group.
            if (group) {
                group.add(alien);
            }
        }
    };

    Phaser.Alien = Alien;
});