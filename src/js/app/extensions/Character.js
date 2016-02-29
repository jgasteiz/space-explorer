define([
    'Phaser',
    'modules/Config',
    'modules/Print',
    'modules/Utils'
], function (Phaser, Config, Print, Utils) {

    var config = Config.getConfig();

    /**
     * Character constructor method.
     * Initialise the sprite, its properties and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @constructor
     */
    var Character = function (game, x, y, sprite) {
        Phaser.Sprite.call(this, game, x, y, sprite);
        this.initializeConfig(Config.getCharacterConfig());

        // Physics and position
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.body.collideWorldBounds = true;
        this.body.mass = -100;

        // Boolean to determine whether the character is selected or not.
        this.isSelected = false;

        // Setup animations
        this.animations.add('up', [0]);
        this.animations.add('right', [1]);
        this.animations.add('down', [2]);
        this.animations.add('left', [3]);
        this.animations.add('upright', [4]);
        this.animations.add('rightdown', [5]);
        this.animations.add('downleft', [6]);
        this.animations.add('leftup', [7]);

        // Healthbar
        this.healthBar = game.add.text(0, 0, this.health,
            {font: '18px Arial', align: 'center', fill: 'rgba(0, 255, 0, 0.2)'});
        this.healthBar.anchor.set(0.5);

        // Select character if clicked on it.
        this.events.onInputDown.add(function (sprite, pointer) {
            if (!this.isSelectable || pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
                return;
            }
            this.selectCharacter();
            this.game.selectedUnits.push(this);
        }, this);

        // Move to the clicked position if the chaacter is alive and selected.
        this.game.input.activePointer.rightButton.onDown.add(function (evt) {
            if (!this.isAlive()) {
                // TODO: Game over
                return;
            }
            if (!this.isSelected) {
                return;
            }
            this.moveToXY(evt.parent.worldX, evt.parent.worldY);
        }, this);

        // Add to the game
        game.add.existing(this);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    /**
     * Return the character name property.
     */
    Character.prototype.getCharacterName = function () {
        return this.characterName;
    };

    /**
     * Initialise character properties from a config object.
     * @param characterConfig
     */
    Character.prototype.initializeConfig = function (characterConfig) {
        for (var prop in characterConfig) {
            if (characterConfig.hasOwnProperty(prop)) {
                this[prop] = characterConfig[prop];
            }
        }
    };

    /**
     * Mark the isSelected flag as true.
     */
    Character.prototype.selectCharacter = function () {
        this.isSelected = true;
    };

    /**
     * Mark the isSelected flag as false.
     */
    Character.prototype.deselectCharacter = function () {
        this.isSelected = false;
    };

    /**
     * Get the character health.
     * @returns {number|*}
     */
    Character.prototype.getHealth = function () {
        return this.health;
    };

    /**
     * Set the character health.
     * @param newHealth
     */
    Character.prototype.setHealth = function (newHealth) {
        this.health = newHealth;
    };

    /**
     * Add health to the character.
     * @param extraHealth
     */
    Character.prototype.addHealth = function (extraHealth) {
        if (extraHealth > 0) {
            var newHealth = Phaser.Math.min(this.getHealth() + extraHealth, this.maxHealth);
            this.setHealth(newHealth);
        }
    };

    /**
     * Return whether the character is alive or not.
     * @returns {boolean}
     */
    Character.prototype.isAlive = function () {
        return this.alive;
    };

    /**
     * Attach another character.
     * @param character
     */
    Character.prototype.attack = function (character) {
        Print.log('Atacking ' + character + ': to be implemented');
    };

    Character.prototype.getAttackValue = function () {
        return this.strength * this.attackValue;
    };

    /**
     * Patrol around a given position x,y.
     * @param x
     * @param y
     */
    Character.prototype.patrol = function (x, y) {
        Print.log('Patroling around ' + x +  ', ' + y + ': to be implemented');
    };

    /**
     * Move the character to a given position x,y.
     * @param x
     * @param y
     */
    Character.prototype.moveToXY = function (x, y) {
        if (!this.isAlive()) {
            return;
        }

        // Set the frame for the direction where the character is moving.
        this.setFrameForRotation(this.game.physics.arcade.moveToXY(this, x, y, this.speed) + (window.Math.PI / 2));

        // Set the desired destination.
        this.desiredDestination = {x: x, y: y};
    };

    /**
     * Set the right frame of the sprite depending on the given rotation.
     * @param rotation
     */
    Character.prototype.setFrameForRotation = function (rotation) {

        this._rotation = rotation;

        var degrees = rotation * 180 / Math.PI;
        if (degrees < 0) {
            degrees = degrees + 360;
        }

        if (degrees > 336 || degrees < 23) {
            this.animations.play('up', 0, true);
            this._frame = 0;
        } else if (degrees > 22 && degrees < 68) {
            this.animations.play('upright', 0, true);
            this._frame = 1;
        } else if (degrees > 67 && degrees < 113) {
            this.animations.play('right', 0, true);
            this._frame = 2;
        } else if (degrees > 112 && degrees < 158) {
            this.animations.play('rightdown', 0, true);
            this._frame = 3;
        } else if (degrees > 157 && degrees < 203) {
            this.animations.play('down', 0, true);
            this._frame = 4;
        } else if (degrees > 202 && degrees < 248) {
            this.animations.play('downleft', 0, true);
            this._frame = 5;
        } else if (degrees > 247 && degrees < 293) {
            this.animations.play('left', 0, true);
            this._frame = 6;
        } else if (degrees > 292 && degrees < 337) {
            this.animations.play('leftup', 0, true);
            this._frame = 7;
        }
    };

    /**
     * Method that makes a character move around the screen.
     */
    Character.prototype.moveAroundWorld = function () {
        // Update the callback for movement completed.
        this.onCompleteMovement = this.moveAroundWorld;

        // Move to some random place.
        this.moveToXY(
            this.game.rnd.integerInRange(100, config.worldWidth - 100),
            this.game.rnd.integerInRange(100, config.worldHeight - 100)
        );
    };

    /**
     * Function called when the movement animation is completed.
     */
    Character.prototype.onCompleteMovement = function () {
        //this.animations.play('standby');
    };

    /**
     * Add damage to the character.
     * @param amount
     */
    Character.prototype.addDamage = function (amount) {
        this.setHealth(this.getHealth() - amount / this.resistance);
        this.receiveShot();
        if (this.getHealth() < 1) {
            this.die();
        }
    };

    /**
     * Add powerUp to the character.
     * @param powerUp
     */
    Character.prototype.addPowerUp = function (powerUp) {
        if (powerUp.getType() === Phaser.PowerUp.HEALTH) {
            this.addHealth(powerUp.getValue());
        }
    };

    /**
     * Character dies.
     * Mark the sprite as dead, remove the healthbar and play dying animation.
     */
    Character.prototype.die = function () {
        if (!this.isAlive()) {
            return;
        }

        this.healthBar.kill();
        this.kill();

        var death = this.game.add.sprite(this.position.x, this.position.y, 'death');
        death.anchor.setTo(0.5);
        death.animations.add('death');
        death.animations.play('death', 40, false, true);
    };

    /**
     * Play shot animation in the character.
     */
    Character.prototype.receiveShot = function () {
        var impact = this.game.add.sprite(
            this.game.rnd.integerInRange(this.position.x - this.width / 2, this.position.x + this.width / 2),
            this.game.rnd.integerInRange(this.position.y - this.height / 2, this.position.y + this.height / 2),
            'impact');
        impact.anchor.setTo(0.5);
        impact.animations.add('impact');
        impact.animations.play('impact', 20, false, true);
    };

    /**
     * Set body velocity to 0 and tell the parent group to notify the rest of the
     * selected characters (within the same group) about the arrival.
     * @param notifySiblings
     */
    Character.prototype.arriveToDestination = function (notifySiblings) {
        this.desiredDestination = null;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.onCompleteMovement();

        if (notifySiblings && this.parent.hasOwnProperty('notifyActiveChildrenOfArrival')) {
            this.parent.notifyActiveChildrenOfArrival();
        }
    };

    /**
     * Character's update method.
     */
    Character.prototype.update = function () {
        // If there is a desired destination and the spaceship reaches it,
        // change its velocity to 0.
        if (this.desiredDestination) {
            var distanceToDestination = this.position.distance(this.desiredDestination, true);
            if (distanceToDestination < 50) {
                this.arriveToDestination(true);
            }
        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }

        // Update healthbar position
        this.healthBar.x = Math.floor(this.x);
        this.healthBar.y = Math.floor(this.y - this.height + 30);
        this.healthBar.setText(this.getHealth());
        var c = Utils.getRgbColourFromValue(this.getHealth());
        this.healthBar.style.fill = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + (this.isSelected || !this.isSelectable ? 1 : 0.5) + ')';
    };

    /**
     * Return the x,y position of the head of the sprite.
     * @param angle - if the angle is specified, use this instead of the sprite current angle.
     * @return {object} {x: float, y: float}
     */
    Character.prototype.getHeadPosition = function (angle) {
        var angleInRadians = this._rotation;
        if (angle) {
            angleInRadians = angle;
        }
        var newAngle = 2 * Math.PI - angleInRadians - 3 * Math.PI / 2;
        return {
            x: this.position.x + (Math.cos(newAngle) * this.width / 2),
            y: this.position.y - (Math.sin(newAngle) * this.height / 2)
        };
    };

    /**
     * Retrieve the coordinates of the sprite head if the rotation is being done
     * by frames rather than by the rotation property.
     * @returns {*}
     */
    Character.prototype.getHeadPositionForFrame = function () {
        this.headPositionForFrame = [
            {x: this.position.x, y: this.position.y - this.height / 2},
            {x: this.position.x + this.width / 2, y: this.position.y - this.height / 2},
            {x: this.position.x + this.width / 2, y: this.position.y},
            {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2},
            {x: this.position.x, y: this.position.y + this.height / 2},
            {x: this.position.x - this.width / 2, y: this.position.y + this.height / 2},
            {x: this.position.x - this.width / 2, y: this.position.y},
            {x: this.position.x - this.width / 2, y: this.position.y - this.height / 2}
        ];
        return this.headPositionForFrame[this._frame];
    };

    /**
     * Return the x,y position of the tail of the sprite.
     * @return {object} {x: float, y: float}
     */
    Character.prototype.getTailPosition = function () {
        return this.getHeadPosition(this.rotation + Math.PI);
    };

    /**
     * Return the x,y position of the tail of the sprite.
     * @return {object} {x: float, y: float}
     */
    Character.prototype.getRightCenterPosition = function () {
        return this.getHeadPosition(this.rotation + Math.PI / 2);
    };

    /**
     * Return the x,y position of the tail of the sprite.
     * @return {object} {x: float, y: float}
     */
    Character.prototype.getLeftCenterPosition = function () {
        return this.getHeadPosition(this.rotation - Math.PI / 2);
    };

    Phaser.Character = Character;
});
