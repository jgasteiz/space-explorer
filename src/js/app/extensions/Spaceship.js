define([
    'Phaser',
    'modules/Config',
    'modules/Print',
    'extensions/Character'
], function (Phaser, Config, Print) {

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
        Phaser.Character.call(this, game, x, y, sprite);
        Phaser.Character.prototype.initializeConfig.call(this, Config.getSpaceshipConfig());

        this.anchor.setTo(0.5, 0.4);

        // Setup bullets
        this.bullets = [];
        this.bulletsGroup = this.game.add.group();
        this.bulletsGroup.enableBody = true;
        this.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Setup animations
        this.animations.add('move', [1,2,3]);
        this.animations.add('standby', [0]);

        // Setup the fire key.
        this.firekey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

        // Move to the clicked position if the spaceship is alive and selected.
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
    };

    Spaceship.prototype = Object.create(Phaser.Character.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Fire a bullet towards the given pointer.
     * @param x
     * @param y
     */
    Spaceship.prototype.fireOnXY = function (x, y) {
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
            this.fireOnXY(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
        }
    };

    Phaser.Spaceship = Spaceship;
});
