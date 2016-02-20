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

        Phaser.Sprite.call(self, game, x, y, sprite);

        self.tweens = [];
        self.bullets = [];
        self.bulletsGroup = self.game.add.group();
        self.bulletsGroup.enableBody = true;
        self.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        self.bulletsGroup.setAll('anchor.x', 0.5);
        self.bulletsGroup.setAll('anchor.y', 0.5);
        self.bulletsGroup.setAll('outOfBoundsKill', true);
        self.bulletsGroup.setAll('checkWorldBounds', true);

        self.anchor.setTo(0.5);
        game.physics.arcade.enable(self);
        self.body.collideWorldBounds = true;

        game.add.existing(self);
    };

    Spaceship.prototype = Object.create(Phaser.Sprite.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Method that moves the player to a given pointer.
     * @param pointer
     */
    Spaceship.prototype.moveToPointer = function (pointer) {
        var self = this;

        // Stop animations
        self.tweens.forEach(function (tween) {
            if (tween.isRunning) {
                tween.stop();
            }
        });
        self.tweens = [];

        var duration = parseInt((self.game.physics.arcade.distanceToXY(self, pointer.x, pointer.y) / 300) * 1000, 10);

        self.tweens.push(self.game.add.tween(self).to({
            x: pointer.x,
            y: pointer.y
        }, Math.max(duration, 400), Phaser.Easing.Quadratic.InOut, true));

        // Rotate the player.
        self.tweens.push(self.game.add.tween(self).to({
            angle: _getRotationAngle(self, pointer)
        }, 300, Phaser.Easing.Linear.None, true, 100));
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
            bullet.angle = _getFinalAngle(bullet, pointer);

            self.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            self.game.physics.arcade.moveToPointer(bullet, config.fireSpeed, pointer, null);
        }
    };

    /**
     * Calculate the new angle a sprite needs to have to look at a
     * destination pointer.
     * @param sprite
     * @param destination
     */
    function _getFinalAngle (sprite, destination) {
        // Calculate the angle between the two points and the Y axis.
        var angle = (Math.atan2(destination.y - sprite.y, destination.x - sprite.x) * 180 / Math.PI) + 90;

        // If the angle is negative, turn it into 360 based.
        if (angle < 0) {
            angle = 360 + angle;
        }

        return angle;
    }

    /**
     * Calculate how much a sprite has to rotate to look at a
     * destination pointer.
     * @param sprite
     * @param destination
     * @returns {string}
     */
    function _getRotationAngle (sprite, destination) {
        var angle = _getFinalAngle(sprite, destination);

        // Calculate the angle to rotate.
        var rotationAngle = parseInt(angle - sprite.angle, 10) % 360;

        // If we're going to turn more than 180 degrees, turn anti-clockwise.
        if (rotationAngle > 180) {
            rotationAngle = -(360 - rotationAngle);
        }

        // Format it to a string with either `+` or `-`.
        rotationAngle = rotationAngle > 0 ? '+' + String(rotationAngle) : '-' + String(Math.abs(rotationAngle));

        return String(rotationAngle);
    }

    Phaser.Spaceship = Spaceship;
});