define([
    'Phaser',
    'utils/Config',
    'extensions/Character'
], function (Phaser, Config) {

    var config = Config.getConfig();

    /**
     * Spaceship constructor method.
     * Initialise the sprite, the bullets and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @constructor
     */
    var Spaceship = function (game, x, y, sprite) {
        var self = this;

        Phaser.Character.call(self, game, x, y, sprite);

        self.bullets = [];
        self.bulletsGroup = self.game.add.group();
        self.bulletsGroup.enableBody = true;
        self.body.collideWorldBounds = true;
        self.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Setup animations
        self.animations.add('move', [1,2,3]);
        self.animations.add('standby', [0]);
    };

    Spaceship.prototype = Object.create(Phaser.Character.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Fire a bullet towards the given pointer.
     * @param x
     * @param y
     */
    Spaceship.prototype.fireOnXY = function (x, y) {
        var self = this;

        var lastBullet = self.bullets[self.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + config.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            var bullet = self.bulletsGroup.create(self.position.x, self.body.position.y + self.body.height / 2, 'bullet');
            bullet.anchor.x = 1;
            bullet.anchor.y = 1;
            bullet.outOfBoundsKill = true;
            bullet.checkWorldBounds = true;

            self.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            bullet.rotation = self.game.physics.arcade.moveToXY(bullet, x, y, config.fireSpeed) + (Math.PI / 2);
            self.game.world.bringToTop(self);
        }
    };

    Phaser.Spaceship = Spaceship;
});
