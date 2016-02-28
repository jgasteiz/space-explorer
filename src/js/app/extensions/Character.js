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

        // Boolean to determine whether the character is selected or not.
        this.isSelected = false;

        // Animations
        this.animations.add('move');
        this.animations.add('standby');

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

        // Green circle to show up if the character is selected
        this.selectionCircle = game.add.graphics(this.position.x, this.position.y);
        this.selectionCircle.lineStyle(1, 0x00FF00, 0.6);
        this.selectionCircle.drawCircle(35, 35, 70);
        this.selectionCircle.visible = false;

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

        // Start move animation.
        this.animations.play('move', 10, true);
        // Move the spaceship to the destination and set its rotation.
        this.rotation = this.game.physics.arcade.moveToXY(this, x, y, this.speed) + (window.Math.PI / 2);
        // Set the desired destination.
        this.desiredDestination = {x: x, y: y};
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
        this.animations.play('standby');
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
     * Character's update method.
     */
    Character.prototype.update = function () {
        // If there is a desired destination and the spaceship reaches it,
        // change its velocity to 0.
        if (this.desiredDestination) {
            var distanceToDestination = this.position.distance(this.desiredDestination, true);
            if (distanceToDestination < 50) {
                this.desiredDestination = null;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.onCompleteMovement();
            }
        }

        // Update healthbar position
        this.healthBar.x = Math.floor(this.x);
        this.healthBar.y = Math.floor(this.y - this.height + 30);
        this.healthBar.setText(this.getHealth());
        var c = Utils.getRgbColourFromValue(this.getHealth());
        this.healthBar.style.fill = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + (this.isSelected || !this.isSelectable ? 1 : 0.5) + ')';

        // Show the selection circle and update its posision if the Character is selected.
        if (this.isSelected) {
            this.selectionCircle.visible = true;
            this.selectionCircle.position.x = this.body.position.x - 10;
            this.selectionCircle.position.y = this.body.position.y - 10;
        } else {
            this.selectionCircle.visible = false;
        }
    };

    /**
     * Return the x,y position of the head of the sprite.
     * @param angle - if the angle is specified, use this instead of the sprite current angle.
     * @return {object} {x: float, y: float}
     */
    Character.prototype.getHeadPosition = function (angle) {
        var angleInRadians = this.rotation;
        if (angle) {
            angleInRadians = angle;
        }
        var angle = 2 * Math.PI - angleInRadians - 3 * Math.PI / 2;
        return {
            x: this.position.x + (Math.cos(angle) * this.width / 2),
            y: this.position.y - (Math.sin(angle) * this.height / 2)
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
