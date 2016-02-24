define([
    'Phaser',
    'utils/Config',
    'utils/Print'
], function (Phaser, Config, Print) {

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

        self.speed = 300;

        self.anchor.setTo(0.5);
        game.physics.arcade.enable(self);
        self.body.collideWorldBounds = true;
        self.inputEnabled = true;
        self.input.useHandCursor = true;

        game.add.existing(self);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    /**
     * Method that moves the character to a given x y.
     * @param x
     * @param y
     * @param onCompleteMovement
     */
    Character.prototype.moveToXY = function (x, y, onCompleteMovement) {
        var self = this;

        if (!self.alive) {
            return;
        }

        // Stop tweens
        self.tweens.forEach(function (tween) {
            if (tween.isRunning) {
                tween.stop();
            }
        });
        self.tweens = [];

        var duration = parseInt((self.game.physics.arcade.distanceToXY(self, x, y) / self.speed) * 1000, 10);

        // Move the character.
        var movementTween = self.game.add.tween(self).to({
            x: x,
            y: y
        }, Math.max(duration, 400), Phaser.Easing.Quadratic.InOut, true);

        // If a callback for complete movement has been specified, add it.
        if (onCompleteMovement) {
            movementTween.onComplete.add(onCompleteMovement, self);
        } else {
            movementTween.onComplete.add(self.onCompleteMovement, self);
        }

        // Rotate the character.
        var rotationTween = self.game.add.tween(self).to({
            angle: self.getRotationAngle(self, x, y)
        }, 300, Phaser.Easing.Linear.None, true, 100);
        rotationTween.onComplete.add(self.onCompleteRotation, self);

        self.tweens.push(movementTween);
        self.tweens.push(rotationTween);
    };

    /**
     * Method that makes a character move around the screen.
     */
    Character.prototype.moveAround = function () {
        var self = this;

        var randomXY = Phaser.Character.getRandomWorldCoordinates();

        self.moveToXY(
            randomXY.x,
            randomXY.y,
            self.moveAround
        );
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
     * Calculate the new angle a sprite needs to have to look at a position x y.
     * @param sprite
     * @param x
     * @param y
     */
    Character.prototype.getFinalAngle = function (sprite, x, y) {
        // Calculate the angle between the two points and the Y axis.
        var angle = (Math.atan2(y - sprite.y, x - sprite.x) * 180 / Math.PI) + 90;

        // If the angle is negative, turn it into 360 based.
        if (angle < 0) {
            angle = 360 + angle;
        }

        return angle;
    };

    /**
     * Create an explosion animation and kill the sprite.
     */
    Character.prototype.killWithAnimation = function (animationName) {
        var self = this;

        if (!self.alive) {
            return;
        }

        self.alive = false;

        self.loadTexture(animationName, 0);
        self.animations.add(animationName);
        // To play the animation with the new texture ( 'key', frameRate, loop, killOnComplete)
        self.animations.play(animationName, 30, false, true);
        self.animations.currentAnim.onComplete.add(function () {
            self.kill();
            Print.log(['Killed:', self]);
        }, this);
    };

    /**
     * Calculate how much a sprite has to rotate to look at a position x, y.
     * @param sprite
     * @param x
     * @param y
     * @returns {string}
     */
    Character.prototype.getRotationAngle = function (sprite, x, y) {
        var self = this;

        var angle = self.getFinalAngle(sprite, x, y);

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

    /**
     * Helper function to return a random set of coordinates based in the world
     * size.
     * @returns {{x: number, y: number}}
     */
    Character.getRandomWorldCoordinates = function () {
        return {
            x: 120 + (Math.random() * config.worldWidth - 120),
            y: 120 + (Math.random() * config.worldHeight - 120)
        }
    };

    Phaser.Character = Character;
});
