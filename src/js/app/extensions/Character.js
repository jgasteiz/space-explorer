define(['Phaser', 'Config'], function (Phaser, Config) {

    var config = Config.getConfig();

    /**
     * Character constructor method.
     * Initialise the sprite, the bullets and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @constructor
     */
    var Character = function (game, x, y, sprite) {
        var self = this;

        Phaser.Sprite.call(self, game, x, y, sprite);

        self.tweens = [];

        self.anchor.setTo(0.5);
        game.physics.arcade.enable(self);
        self.body.collideWorldBounds = true;

        game.add.existing(self);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    /**
     * Method that moves the character to a given pointer.
     * @param pointer
     */
    Character.prototype.moveToPointer = function (pointer) {
        var self = this;

        // Stop tweens
        self.tweens.forEach(function (tween) {
            if (tween.isRunning) {
                tween.stop();
            }
        });
        self.tweens = [];

        var duration = parseInt((self.game.physics.arcade.distanceToXY(self, pointer.x, pointer.y) / 300) * 1000, 10);

        // Move the character.
        var movementTween = self.game.add.tween(self).to({
            x: pointer.x,
            y: pointer.y
        }, Math.max(duration, 400), Phaser.Easing.Quadratic.InOut, true);
        movementTween.onComplete.add(self.onCompleteMovement, self);

        // Rotate the character.
        var rotationTween = self.game.add.tween(self).to({
            angle: self.getRotationAngle(self, pointer)
        }, 300, Phaser.Easing.Linear.None, true, 100);
        rotationTween.onComplete.add(self.onCompleteRotation, self);

        self.tweens.push(movementTween);
        self.tweens.push(rotationTween);
    };

    /**
     * Function called when the movement animation is completed.
     */
    Character.prototype.onCompleteMovement = function () {};

    /**
     * Function called when the rotation animation is completed.
     */
    Character.prototype.onCompleteRotation = function () {};

    /**
     * Calculate the new angle a sprite needs to have to look at a
     * destination pointer.
     * @param sprite
     * @param destination
     */
    Character.prototype.getFinalAngle = function (sprite, destination) {
        // Calculate the angle between the two points and the Y axis.
        var angle = (Math.atan2(destination.y - sprite.y, destination.x - sprite.x) * 180 / Math.PI) + 90;

        // If the angle is negative, turn it into 360 based.
        if (angle < 0) {
            angle = 360 + angle;
        }

        return angle;
    };

    /**
     * Calculate how much a sprite has to rotate to look at a
     * destination pointer.
     * @param sprite
     * @param destination
     * @returns {string}
     */
    Character.prototype.getRotationAngle = function (sprite, destination) {
        var angle = this.getFinalAngle(sprite, destination);

        // Calculate the angle to rotate.
        var rotationAngle = parseInt(angle - sprite.angle, 10) % 360;

        // If we're going to turn more than 180 degrees, turn anti-clockwise.
        if (rotationAngle > 180) {
            rotationAngle = -(360 - rotationAngle);
        }

        // Format it to a string with either `+` or `-`.
        rotationAngle = rotationAngle > 0 ? '+' + String(rotationAngle) : '-' + String(Math.abs(rotationAngle));

        return String(rotationAngle);
    };

    Phaser.Character = Character;
});