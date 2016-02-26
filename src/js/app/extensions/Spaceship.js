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
            var bullet = this.bulletsGroup.create(this.position.x, this.body.position.y + this.body.height / 2, 'bullet');
            bullet.anchor.x = 1;
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

        // Listen for mouse input and update the spaceship.
        if (this.game.input.activePointer.isDown && this.game.input.activePointer.isMouse) {
            var mousePointer = this.game.input.mousePointer;
            if (this.game.input.activePointer.button == Phaser.Mouse.RIGHT_BUTTON) {
                this.fireOnXY(mousePointer.worldX, mousePointer.worldY);
            } else if (this.game.input.activePointer.button == Phaser.Mouse.LEFT_BUTTON) {
                this.moveToXY(mousePointer.worldX, mousePointer.worldY);
            }
        }
    };

    Phaser.Spaceship = Spaceship;
});
