define([
    'Phaser',
    'modules/Utils',
    'extensions/Character'
], function (Phaser, Utils) {

    /**
     * Spaceship constructor method.
     * Initialise the sprite, the bullets and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @constructor
     */
    var Spaceship = function (game, x, y) {
        Phaser.Character.call(this, game, x, y, 'battlecruiser');
        Phaser.Character.prototype.initializeConfig.call(this, game.cache.getJSON('config')['spaceshipConfig']);

        this.anchor.setTo(0.5, 0.4);

        // Setup bullets
        this.bullets = [];
        this.bulletsGroup = this.game.add.group();
        this.bulletsGroup.enableBody = true;
        this.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Easing for start/end of the movement tween - slower at the beginning and end.
        this.movementEasing = Phaser.Easing.Sinusoidal.InOut;

        // Setup the fire key.
        this.firekey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

        // Setup animations
        this.animations.add('up', [0]);
        this.animations.add('right', [1]);
        this.animations.add('down', [2]);
        this.animations.add('left', [3]);
        this.animations.add('upright', [4]);
        this.animations.add('rightdown', [5]);
        this.animations.add('downleft', [6]);
        this.animations.add('leftup', [7]);

        // Set initial animation and rotation
        this.animations.play('rightdown', 0, true);
        this._rotation = 3 * Math.PI / 4;
    };

    Spaceship.prototype = Object.create(Phaser.Character.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Fire a bullet towards the given pointer.
     * @param x
     * @param y
     */
    Spaceship.prototype.attack = function (x, y) {
        if (!this.isAlive()) {
            return;
        }

        var lastBullet = this.bullets[this.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + this.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            // The bullet should spawn in the front of the spaceship..
            var headPosition = this.getHeadPosition(),
                bullet = this.bulletsGroup.create(headPosition.x, headPosition.y, 'bullet');

            bullet.anchor.x = 0.5;
            bullet.anchor.y = 1;
            bullet.outOfBoundsKill = true;
            bullet.checkWorldBounds = true;

            this.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            bullet.rotation = this.game.physics.arcade.moveToXY(bullet, x, y, this.fireSpeed) + (Math.PI / 2);
            this.game.world.bringToTop(this);
        }
    };

    /**
     * Spaceship's update method.
     */
    Spaceship.prototype.update = function () {
        Phaser.Character.prototype.update.call(this);

        if (!this.isAlive()) {
            // TODO: Game over
            return;
        }

        // Fire if the key is pressed and the spaceship is selected.
        if (this.firekey.isDown) {
            if (!this.isSelected) {
                return;
            }
            this.attack(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
        }
    };

    Phaser.Spaceship = Spaceship;
});
