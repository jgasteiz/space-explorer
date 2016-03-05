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

        // Healthbar
        this.initializeHealthBar();

        // Initialise the angle breakpoints.
        this.initializeAngleBreakpoints();

        // Initialize mouse click events.
        this.initializeMouseEvents();

        // Add character to the game
        game.add.existing(this);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    /**
     * Initialize the mouse events for the character:
     * - right click on another character: if it's an enemy and characters
     *   are selected, set as active enemy.
     * - left click on character: select character.
     * - right click on game background sprite (starfield): go to that position
     *   in the world.
     */
    Character.prototype.initializeMouseEvents = function () {
        // Set up click events on character
        this.events.onInputDown.add(function (_, pointer) {
            if (pointer.button === Phaser.Mouse.LEFT_BUTTON) {
                // If the character is selectable, select it.
                if (this.isSelectable) {
                    this.game.selectedUnits.forEach(function (unit) {
                        unit.deselectCharacter();
                    });
                    this.selectCharacter();
                    this.game.selectedUnits = [this];
                }
            } else if (pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
                // If the character is an enemy and there are any selected
                // units, set clicked character as active target.
                if (this.enemy && this.game.selectedUnits.length > 0) {
                    this.game.selectedUnits.forEach(function (character) {
                        character.setActiveTarget(this);
                    }, this);
                }
            }
        }, this);

        // Move to the clicked position if the chaacter is alive and selected.
        // If the scenario is clicked, go to the clicked position.
        this.game.starfield.events.onInputDown.add(function (sprite, pointer) {
            if (pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
                if (!this.isAlive()) {
                    // TODO: Game over
                    return;
                }
                if (!this.isSelected) {
                    return;
                }
                this.moveToXY(pointer.worldX, pointer.worldY);
            }
        }, this);
    };

    /**
     * Initialize the character's health bar.
     */
    Character.prototype.initializeHealthBar = function () {
        this.healthBar = this.game.add.text(0, 0, this.getHealth(),
            {font: '18px \'Share Tech Mono\'', align: 'center', fill: 'rgba(0, 255, 0, 0.2)'});
        this.healthBar.anchor.set(0.5);
    };

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
     * Given the number of specified rotation animations, calculate the angle
     * breakpoints that will correspond to each animation frame.
     */
    Character.prototype.initializeAngleBreakpoints = function () {
        if (!this.animationFrames) {
            return;
        }

        var degreesInterval = 360 / this.animationFrames.length;
        this.angleBreakpoins = [];
        for (var i = 360 - degreesInterval / 2; i > 0 ; i -= degreesInterval) {
            this.angleBreakpoins.push(i);
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
        this.health = parseInt(newHealth, 10);
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

        // Get the angle in degrees to where the spaceship should look to.
        var degrees = rotation * 180 / Math.PI;
        if (degrees < 0) {
            degrees = degrees + 360;
        }

        // Get the right animation frame depending on the angle.
        var direction;
        this.angleBreakpoins.forEach(function (breakpoint, index) {
            if (!direction && degrees > breakpoint) {
                direction = this.animationFrames[index];
            }
        }, this);

        if (!direction) {
            direction = this.animationFrames[0];
        }

        // Set the animation frame.
        this.animations.play(direction, 0, true);
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
        Print.log('on complete movement');
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

        // Attack the active target
        this.attackActiveTarget();
    };

    /**
     * Set an active target.
     * @param character
     */
    Character.prototype.setActiveTarget = function (character) {
        this.activeTarget = character;
    };

    /**
     * Attack the active target, if there's any.
     */
    Character.prototype.attackActiveTarget = function () {
        if (this.activeTarget) {
            if (!this.activeTarget.isAlive()) {
                this.activeTarget = null;
            } else {
                this.attack(this.activeTarget.position.x, this.activeTarget.position.y);
            }
        }
    };

    /**
     * Attack a given position
     * @param x
     * @param y
     */
    Character.prototype.attack = function (x, y) {
        Print.log('To be implemented');
    };

    /**
     * Get the character's attack value multiplied by its strength.
     * @returns {number}
     */
    Character.prototype.getAttackValue = function () {
        return this.strength * this.attackValue;
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
