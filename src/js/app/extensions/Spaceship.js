define(['Phaser', 'Config'], function (Phaser, Config) {

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
        self.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        self.bulletsGroup.setAll('anchor.x', 0.5);
        self.bulletsGroup.setAll('anchor.y', 0.5);
        self.bulletsGroup.setAll('outOfBoundsKill', true);
        self.bulletsGroup.setAll('checkWorldBounds', true);

        self.animations.add('move', [1,2,3]);
        self.animations.add('standby', [0]);
    };

    Spaceship.prototype = Object.create(Phaser.Character.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Method that moves the player to a given pointer.
     * @param pointer
     */
    Spaceship.prototype.moveToPointer = function (pointer) {
        var self = this;

        // Start move animation.
        self.animations.play('move', 10, true);

        Phaser.Character.prototype.moveToPointer.call(self, pointer);
    };

    Spaceship.prototype.onCompleteMovement = function () {
        this.animations.play('standby');
    };

    /**
     * Fire a bullet towards the given pointer.
     * @param pointer
     */
    Spaceship.prototype.fireToPointer = function (pointer) {
        var self = this;

        var lastBullet = self.bullets[self.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + config.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            var bullet = self.bulletsGroup.create(self.position.x, self.position.y, 'bullet');
            bullet.angle = self.getFinalAngle(bullet, pointer);

            self.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            self.game.physics.arcade.moveToPointer(bullet, config.fireSpeed, pointer, null);
        }
    };

    Phaser.Spaceship = Spaceship;
});