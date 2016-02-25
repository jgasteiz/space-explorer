define([
    'Phaser',
    'modules/Config',
    'modules/Print'
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

        // Physics and position
        self.anchor.setTo(0.5);
        game.physics.arcade.enable(self);
        self.inputEnabled = true;
        self.input.useHandCursor = true;
        self.body.collideWorldBounds = true;

        // Animations
        self.animations.add('move');
        self.animations.add('standby');

        // Character properties
        self.speed = 300;
        self.health = 100;

        // Healthbar
        self.healthBar = game.add.text(0, 0, self.health,
            {font: '18px Arial', align: 'center', fill: '#00ff00'});
        self.healthBar.anchor.set(0.5);

        // Add to the game
        game.add.existing(self);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    /**
     * Method that moves the character to a given x y.
     * @param x
     * @param y
     */
    Character.prototype.moveToXY = function (x, y) {
        var self = this;

        if (!self.alive) {
            return;
        }

        // Start move animation.
        self.animations.play('move', 10, true);

        self.rotation = self.game.physics.arcade.moveToXY(self, x, y, self.speed) + (Math.PI / 2);

        self.desiredDestination = {
            x: x,
            y: y
        };
    };

    /**
     * Method that makes a character move around the screen.
     */
    Character.prototype.moveAround = function () {
        var self = this;

        var randomXY = Phaser.Character.getRandomWorldCoordinates();

        // Update the callback for movement completed.
        self.onCompleteMovement = self.moveAround;

        // Move to some random place.
        self.moveToXY(
            randomXY.x,
            randomXY.y
        );
    };

    /**
     * Reduce the amount of health of the character. If the health goes to
     * 0 or below, kill the character.
     * @param amount
     */
    Character.prototype.loseHealth = function (amount) {
        var self = this;

        self.health = self.health - amount;
        if (self.health < 1) {
            self.killWithAnimation('explosion');
        }
    };

    /**
     * Function called when the movement animation is completed.
     */
    Character.prototype.onCompleteMovement = function () {
        this.animations.play('standby');
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
        self.healthBar.kill();

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
     * Character's update method.
     */
    Character.prototype.update = function () {
        var self = this;

        if (self.desiredDestination) {
            var distanceToDestination = self.position.distance(self.desiredDestination, true);
            if (distanceToDestination < 50) {
                self.desiredDestination = null;
                self.body.velocity.x = 0;
                self.body.velocity.y = 0;
                self.onCompleteMovement();
            }
        }

        // Update healthbar position
        self.healthBar.x = Math.floor(self.x);
        self.healthBar.y = Math.floor(self.y - self.height + 30);
        self.healthBar.setText(self.health);
        self.healthBar.style.fill = Character.getColourForValue(self.health);
    };

    /**
     * Given a value, returns a colour.
     * The higher the value, the more green;
     * The lower the value, the more red.
     * @param value
     * @returns {*}
     */
    Character.getColourForValue = function (value) {
        if (value > 75) {
            return '#0f0';
        } else if (value > 50) {
            return '#ffe500';
        } else if (value > 25) {
            return '#ff9e00';
        }
        return '#f00';
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

///**
// * Calculate the new angle a sprite needs to have to look at a position x y.
// * @param sprite
// * @param x
// * @param y
// */
//Character.prototype.getFinalAngle = function (sprite, x, y) {
//    // Calculate the angle between the two points and the Y axis.
//    var angle = (Math.atan2(y - sprite.y, x - sprite.x) * 180 / Math.PI) + 90;
//
//    // If the angle is negative, turn it into 360 based.
//    if (angle < 0) {
//        angle = 360 + angle;
//    }
//
//    return angle;
//};

///**
// * Calculate how much a sprite has to rotate to look at a position x, y.
// * @param sprite
// * @param x
// * @param y
// * @returns {string}
// */
//Character.prototype.getRotationAngle = function (sprite, x, y) {
//    var self = this;
//
//    var angle = self.getFinalAngle(sprite, x, y);
//
//    // Calculate the angle to rotate.
//    var rotationAngle = parseInt(angle - sprite.angle, 10) % 360;
//
//    // If we're going to turn more than 180 degrees, turn anti-clockwise.
//    if (rotationAngle > 180) {
//        rotationAngle = -(360 - rotationAngle);
//    }
//
//    // Format it to a string with either `+` or `-`.
//    rotationAngle = rotationAngle > 0 ? '+' + String(rotationAngle) : '-' + String(Math.abs(rotationAngle));
//
//    return String(rotationAngle);
//};