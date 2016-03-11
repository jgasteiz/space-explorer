define([
    'Phaser',
    'modules/Utils'
], function (Phaser, Utils) {

    /**
     * PowerUp constructor method.
     * Initialise the sprite, its properties and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @param sprite
     * @param powerUpType
     * @constructor
     */
    var PowerUp = function (game, x, y, sprite, powerUpType) {
        Phaser.Sprite.call(this, game, x, y, sprite);

        // Physics and position
        this.anchor.setTo(0.5);
        game.physics.arcade.enable(this);

        // PowerUp properties
        this.powerUpsConfig = game.cache.getJSON('powerups');
        this.powerUpType = powerUpType;
        this.powerUpValue = this.powerUpsConfig[this.powerUpType];

        // Add to the game
        game.add.existing(this);
    };

    PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
    PowerUp.prototype.constructor = PowerUp;

    PowerUp.prototype.getType = function () {
        return this.powerUpType;
    };

    PowerUp.prototype.getValue = function () {
        return this.powerUpValue;
    };

    PowerUp.HEALTH = 'health';
    PowerUp.RADIOACTIVE = 'radioactive';

    Phaser.PowerUp = PowerUp;
});