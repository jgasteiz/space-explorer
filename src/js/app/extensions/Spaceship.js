define([
    'Phaser',
    'utils/Config',
    'extensions/Character'
], function (Phaser, Config) {

    var config = Config.getConfig();

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
        var self = this;

        Phaser.Character.call(self, game, x, y, sprite);

        self.bullets = [];
        self.bulletsGroup = self.game.add.group();
        self.bulletsGroup.enableBody = true;
        self.body.collideWorldBounds = true;
        self.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Setup animations
        self.animations.add('move', [1,2,3]);
        self.animations.add('standby', [0]);
    };

    Spaceship.prototype = Object.create(Phaser.Character.prototype);
    Spaceship.prototype.constructor = Spaceship;

    /**
     * Method that moves the player to a given pointer.
     * @param pointer
     */
    Spaceship.prototype.moveToPointer = function (pointer) {
        var self = this;

        // Start move animation.
        self.animations.play('move', 10, true);

        Phaser.Character.prototype.moveToPointer.call(self, pointer);
    };

    Spaceship.prototype.onCompleteMovement = function () {
        this.animations.play('standby');
    };

    /**
     * Fire a bullet towards the given pointer.
     * @param pointer
     */
    Spaceship.prototype.fireToPointer = function (pointer) {
        var self = this;

        var lastBullet = self.bullets[self.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + config.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            var bullet = self.bulletsGroup.create(self.position.x, self.body.position.y + self.body.height / 2, 'bullet');
            self.game.world.bringToTop(self);

            bullet.anchor.x = 1;
            bullet.anchor.y = 1;
            bullet.outOfBoundsKill = true;
            bullet.checkWorldBounds = true;

            // debugger;
            bullet.angle = self.getFinalAngle(bullet, {x: pointer.worldX, y: pointer.worldY});

            self.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            self.game.physics.arcade.moveToXY(bullet, pointer.worldX, pointer.worldY, config.fireSpeed, null);
        }
    };

    /**
     * Add method to update the spaceship movement based on cursors.
     * @param cursors
     */
    Spaceship.prototype.updateMovement = function (cursors) {
        var self = this;

        self.body.velocity.x = 0;
        self.body.velocity.y = 0;
        if (cursors.down.isDown && cursors.left.isDown) {
            self.body.velocity.x = -75;
            self.body.velocity.y = 75;
            self.angle = 225;
            self.animations.play('move');
        } else if (cursors.left.isDown && cursors.up.isDown) {
            self.body.velocity.x = -75;
            self.body.velocity.y = -75;
            self.angle = 315;
            self.animations.play('move');
        } else if (cursors.up.isDown && cursors.right.isDown) {
            self.body.velocity.y = -75;
            self.body.velocity.x = 75;
            self.angle = 45;
            self.animations.play('move');
        } else if (cursors.right.isDown && cursors.down.isDown) {
            self.body.velocity.x = 75;
            self.body.velocity.y = 75;
            self.angle = 135;
            self.animations.play('move');
        } else if (cursors.left.isDown) {
            self.body.velocity.x = -150;
            self.angle = 270;
            self.animations.play('move');
        } else if (cursors.up.isDown) {
            self.body.velocity.y = -150;
            self.angle = 0;
            self.animations.play('move');
        } else if (cursors.right.isDown) {
            self.body.velocity.x = 150;
            self.angle = 90;
            self.animations.play('move');
        } else if (cursors.down.isDown) {
            self.body.velocity.y = 150;
            self.angle = 180;
            self.animations.play('move');
        } else {
            self.animations.play('standby');
        }
    };

    Phaser.Spaceship = Spaceship;
});
