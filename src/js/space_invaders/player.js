(function () {

    Phaser.Sprite.prototype.initializeSpaceship = function () {
        this.tweens = [];
        this.bullets = [];
        this.bulletsGroup = this.game.add.group();
        this.bulletsGroup.enableBody = true;
    };

    /**
     * Method that moves the player to a given pointer.
     * @param pointer
     */
    Phaser.Sprite.prototype.moveToPointer = function (pointer) {
        var self = this;

        // Stop animations
        self.tweens.forEach(function (tween) {
            if (tween.isRunning) {
                tween.stop();
            }
        });
        self.tweens = [];

        var duration = parseInt((this.game.physics.arcade.distanceToXY(self, pointer.x, pointer.y) / 300) * 1000, 10);

        self.tweens.push(this.game.add.tween(self).to({
            x: pointer.x,
            y: pointer.y
        }, Math.max(duration, 400), Phaser.Easing.Quadratic.InOut, true));

        // Rotate the player.
        self.tweens.push(this.game.add.tween(self).to({
            angle: getRotationAngle(self, pointer)
        }, 300, Phaser.Easing.Linear.None, true, 100));
    };

    /**
     * Fire a bullet towards the given pointer.
     * @param pointer
     */
    Phaser.Sprite.prototype.fireToPointer = function (pointer) {
        var self = this;

        var lastBullet = self.bullets[self.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + SI.config.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            var bullet = self.bulletsGroup.create(self.position.x, self.position.y, 'bullet');
            bullet.angle = getFinalAngle(bullet, pointer);

            self.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            this.game.physics.arcade.moveToXY(bullet, pointer.x, pointer.y, 300, null);
        }
    };

    /**
     * Calculate the new angle a sprite needs to have to look at a
     * destination pointer.
     * @param sprite
     * @param destination
     */
    function getFinalAngle (sprite, destination) {
        // Calculate the angle between the two points and the Y axis.
        var angle = (Math.atan2(destination.y - sprite.y, destination.x - sprite.x) * 180 / Math.PI) + 90

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
    function getRotationAngle (sprite, destination) {
        var angle = getFinalAngle(sprite, destination);

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
})();